const express = require('express');
const router = express.Router();
const User = require('../models/User')
// const userAuthMiddleware = require('../middleware/userAuthMiddleware')
// const adminMiddleware = require('../middleware/adminMiddleware')

// Get all users
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Aggregation pipeline
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    orderCount: { $size: '$orders' }
                }
            },
            { $skip: skip },
            { $limit: limit },
            { $project: { password: 0, orders: 0 } }
        ]);

        const total = await User.countDocuments();

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalUsers: total
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/admin/profile', async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' }).select('-password');
        
        if (!admin) {
            return res.status(404).json({ msg: 'Admin profile not found' });
        }

        res.json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { fullName, email, role, phone } = req.body;

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (role) user.role = role;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;