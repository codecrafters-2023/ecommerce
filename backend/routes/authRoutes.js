const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        format: 'png',
        public_id: (req, file) => `${uuidv4()}-${Date.now()}`, // Fixed uuid reference
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });


// Register
router.post('/register', upload.single('avatar'), async (req, res) => {
    const { email, password, role, phone, fullName } = req.body;
    let user = null;
    let avatarUrl = null;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    if (!phone.startsWith('+')) {
        return res.status(400).json({
            message: 'Phone number must include country code'
        });
    }

    try {
        // Check for existing user (case-insensitive)
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Handle avatar creation FIRST (before user creation)
        if (req.file) {
            avatarUrl = req.file.path;
        } else {
            const avatarName = fullName || normalizedEmail.split('@')[0];
            avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarName)}`;
        }

        // Create user WITH verification token in single operation
        const emailToken = jwt.sign({ email: normalizedEmail }, process.env.JWT_SECRET, { 
            expiresIn: '1h' 
        });

        user = await User.create({
            email: normalizedEmail,
            password,
            role,
            phone,
            fullName,
            avatar: avatarUrl,
            isEmailVerified: false,
            emailVerificationToken: emailToken,
            emailVerificationExpires: Date.now() + 3600000
        });

        // Only send email AFTER successful user creation
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: `"FarFoo" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailToken}">here</a> to verify</p>`
        }


        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Verification email sent',
            needsVerification: true,
            userId: user._id
        });

    } catch (error) {
        // Aggressive cleanup if ANY part fails
        if (user) {
            await User.deleteOne({ _id: user._id });
        }
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }

        console.error('Registration Error:', error);
        res.status(500).json({
            message: 'Registration failed. No verification email sent.',
            error: error.message
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in.'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Store token in user document (optional)
        user.tokens.push({ token, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        await user.save();

        // Set token in response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            success: true,
            token, // For localStorage
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            subject: 'Password Reset',
            text: `Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.password = password;
        user.passwordChangedAt = Date.now() - 1000;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected route example
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin route example
router.get('/admin', protect, admin, (req, res) => {
    res.json({ message: 'Admin Dashboard' });
});

// ======user update routes =====
router.put('/userUpdate/:id', upload.single('avatar'), async (req, res) => {

    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Handle image upload
    if (req.file) {
        // Delete old image if it's from Cloudinary
        if (user.avatar.includes('res.cloudinary.com')) {
            const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.v2.uploader.destroy(publicId);
        }
        user.avatar = req.file.path;
    }

    // Update fields
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.password = req.body.password || user.password;

    // Check for duplicate email
    if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already exists');
        }
    }

    // Check for duplicate phone
    if (req.body.phone && req.body.phone !== user.phone) {
        const phoneExists = await User.findOne({ phone: req.body.phone });
        if (phoneExists) {
            res.status(400);
            throw new Error('Phone number already exists');
        }
    }


    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        // token: req.user.token // Keep the same token
    });
})

// Email Verification
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Invalid or expired token');

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Redirect to success page
        res.redirect(`${process.env.CLIENT_URL}/verification-success`);
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/verification-error`);
    }
});

// Phone Verification
router.post('/verify-phone', async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({
            phoneVerificationToken: token,
            phoneVerificationExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.isPhoneVerified = true;
        user.phoneVerificationToken = undefined;
        user.phoneVerificationExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Phone verified' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get saved addresses
router.get('/addresses', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
    }
});

// Update/Add address
router.put('/addresses', protect, async (req, res) => {
    try {
        // Step 1: Mark all existing addresses as non-primary
        await User.updateOne(
            { _id: req.user._id },
            { $set: { "addresses.$[].isPrimary": false } }
        );

        // Step 2: Add the new address
        const newUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $push: {
                    addresses: {
                        ...req.body,
                        _id: new mongoose.Types.ObjectId().toString(), // Ensure unique ID
                        isPrimary: true
                    }
                }
            },
            { new: true, runValidators: true }
        );

        res.json({ success: true, addresses: newUser.addresses });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            errorCode: 'ADDRESS_ID_CONFLICT'
        });
    }
});

router.put('/addresses/:id/primary', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Update primary status
        user.addresses.forEach(addr => {
            addr.isPrimary = addr._id.toString() === req.params.id;
        });

        await user.save();
        res.json({
            success: true,
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update primary address'
        });
    }
});

// Update address
router.put('/addresses/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Update fields
        address.set(req.body);
        await user.save();

        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update address' });
    }
});

router.delete('/addresses/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Filter out the deleted address
        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.id
        );

        // Set new primary if needed
        if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isPrimary)) {
            user.addresses[0].isPrimary = true;
        }

        await user.save();
        res.json({
            success: true,
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete address'
        });
    }
});


module.exports = router;