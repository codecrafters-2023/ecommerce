const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingAddress } = req.body;
        
        const order = new Order({
            user: req.user._id,
            items: req.user.cart.items,
            shippingAddress,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            totalAmount: req.user.cart.total
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;