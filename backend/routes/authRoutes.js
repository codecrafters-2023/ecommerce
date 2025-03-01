const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer')


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
        format: async (req, file) => 'png', // or jpeg, webp, etc
        public_id: (req, file) => `${uuid()}-${Date.now()}`,
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

const upload = multer({ storage: storage });



// Register
router.post('/register', upload.single('avatar'), async (req, res) => {
    const { email, password, role, phone, fullName } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Handle image upload
        let avatar = '';
        if (req.file) {
            avatar = req.file.path; // Cloudinary URL
        } else {
            // Generate default avatar using DiceBear API
            const avatarName = fullName || email.split('@')[0];
            avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarName)}&size=64&backgroundType=gradientLinear`;
        }

        const user = await User.create({ email, password, role, phone, fullName, avatar });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({ _id: user._id, email: user.email, role: user.role, avatar: user.avatar, token });
    } catch (error) {
        // Delete uploaded file if error occurred
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({ _id: user._id, email: user.email, role: user.role, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

module.exports = router;