const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

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

module.exports = router;