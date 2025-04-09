const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// import { sendOrderConfirmation } from '../utils/emailService';
const { sendOrderConfirmation } = require('../utils/emailService');

router.post('/', protect, async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingAddress, items, totalAmount } = req.body;

        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            totalAmount
        });

        await order.save();

        // Send emails
        try {
            // To customer
            await sendOrderConfirmation(order, req.user.email);

            // To admin (replace with your admin email)
            await sendOrderConfirmation(order, process.env.ADMIN_EMAIL, true);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders
router.get('/getOrders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders); // Send JSON instead of rendering view
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put('/orders/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: req.body.status },
            { new: true }
        );
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete order
router.delete('/orders/:id', protect, admin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;