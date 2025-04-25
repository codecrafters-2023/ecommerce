const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Products');
const { protect, admin } = require('../middleware/authMiddleware');

// import { sendOrderConfirmation } from '../utils/emailService';
const { sendOrderConfirmation } = require('../utils/emailService');
const Coupon = require('../models/Coupon');

router.post('/', protect, async (req, res) => {
    try {
        const {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            shippingAddress,
            items,
            totalAmount,
            coupon
        } = req.body;

        // Get product images and validate products
        const itemsWithImages = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);

            return {
                ...item,
                image: product.images[0]?.url || ''
            };
        }));

        const itemsWithPrices = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            return {
                ...item,
                price: product.discountPrice || product.price
            };
        }));

        // 2. Calculate actual subtotal
        const subtotal = itemsWithPrices.reduce((sum, item) =>
            sum + item.price * item.quantity, 0);

        // 3. Revalidate coupon and discount
        let discount = 0;
        if (coupon?.code) {
            const validCoupon = await Coupon.findOne({
                code: coupon.code,
                active: true
            });

            if (!validCoupon || validCoupon.usedCount >= validCoupon.maxUses) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon no longer valid"
                });
            }

            // Recalculate discount
            if (validCoupon.discountType === 'percentage') {
                discount = (subtotal * validCoupon.discountAmount) / 100;
                if (validCoupon.maxDiscount) {
                    discount = Math.min(discount, validCoupon.maxDiscount);
                }
            } else {
                discount = validCoupon.discountAmount;
            }

            // Validate total matches
            if (Math.abs(totalAmount - (subtotal - discount)) > 1) {
                return res.status(400).json({
                    success: false,
                    message: "Price mismatch detected"
                });
            }
        }

        // Create order with coupon data
        const order = new Order({
            user: req.user._id,
            items: itemsWithPrices.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            shippingAddress,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            totalAmount: subtotal - discount, // Enforce correct total
            coupon: coupon || null
        });

        await order.save();

        // Update coupon usage if applied
        if (coupon?.code) {
            try {
                await Coupon.updateOne(
                    { code: coupon.code },
                    { $inc: { usedCount: 1 } }
                );
            } catch (couponError) {
                console.error('Coupon usage update failed:', couponError);
            }
        }

        // Send emails
        try {
            // To customer
            await sendOrderConfirmation(order, req.user.email);

            // To admin
            await sendOrderConfirmation(order, process.env.ADMIN_EMAIL, true);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(201).json(order);

    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all orders
router.get('/getOrders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({ deletedAt: { $exists: false }, status: { $ne: 'cancelled' } })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
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

// Get orders for a specific user
router.get('/my-orders', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id, deletedAt: { $exists: false } })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name price image');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// order cancelled
router.get('/cancelled', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({
            status: 'cancelled',
            deletedAt: { $exists: false }
        })
            .populate('user', 'name email')
            .sort({ cancelledAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// User cancels order
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        // 1. Find the order (including soft-deleted ones)
        const order = await Order.findOne({
            _id: req.params.id,
            deletedAt: { $exists: false } // Exclude soft-deleted orders
        });

        // 2. Validate order existence
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // 3. Validate ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }

        // 4. Validate cancellable status
        const allowedStatuses = ['pending', 'processing'];
        if (!allowedStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled in "${order.status}" status`
            });
        }

        // 5. Perform cancellation
        order.status = 'cancelled';
        order.cancelledAt = Date.now();
        order.cancelledBy = req.user._id;
        await order.save();

        res.json({
            success: true,
            order: {
                _id: order._id,
                status: order.status,
                cancelledAt: order.cancelledAt
            }
        });
    } catch (error) {
        console.error("Cancellation Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during cancellation"
        });
    }
});

// User deletes cancelled order
router.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
            status: 'cancelled'
        });

        if (!order) return res.status(404).json({ message: 'Order not found or cannot be deleted' });

        order.deletedAt = Date.now();
        await order.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;