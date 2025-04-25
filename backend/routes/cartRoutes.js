const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Products')
const Coupon = require('../models/Coupon');
const razorpay = require('razorpay');

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get user's cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .select('-__v -createdAt -updatedAt')
            .lean();

        if (!cart) return res.json({ items: [], totalAfterDiscount: 0 });

        // Calculate total if missing (for backward compatibility)
        const calculatedTotal = cart.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        
        res.json({
            items: cart.items,
            totalAfterDiscount: cart.totalAfterDiscount || calculatedTotal,
            coupon: cart.coupon || null
        });
    } catch (error) {
        console.error('Cart Fetch Error:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});


// Add to cart
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += Number(quantity);
            // Update price if it's changed
            existingItem.price = product.discountPrice || product.price;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                price: product.discountPrice || product.price,
                images: product.images,
                quantity: Number(quantity)
            });
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update cart item quantity
router.put('/:itemId', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        const item = cart.items.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from cart
router.delete('/:itemId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item using Mongoose's pull
        cart.items.pull(req.params.itemId);
        const updatedCart = await cart.save();

        res.json(updatedCart);

    } catch (error) {
        res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


// Create Razorpay order
router.post('/payment/create-order', protect, async (req, res) => {
    try {
        const amount = Math.round(req.body.amount * 100); // Convert to paise

        const options = {
            amount,
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.error('Razorpay Error:', err);
                return res.status(500).json({ message: 'Payment gateway error' });
            }
            res.json(order);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Remove all items
        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
});


router.post('/apply-coupon', protect, async (req, res) => {
    try {
        const { code } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Normalize code to uppercase
        const normalizedCode = code.toUpperCase();
        
        // Get total amount from cart items
        const totalAmount = cart.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);

        // Find coupon with normalized code
        const coupon = await Coupon.findOne({ 
            code: normalizedCode,
            active: true 
        });

        if (!coupon) return res.status(400).json({ message: 'Invalid coupon code' });

        // Validate coupon dates
        const now = new Date();
        if (coupon.validFrom && now < coupon.validFrom) {
            return res.status(400).json({ message: 'Coupon not yet valid' });
        }
        
        if (coupon.validUntil && now > coupon.validUntil) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        // Validate usage limits
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        // Validate minimum order amount
        if (totalAmount < coupon.minOrderAmount) {
            return res.status(400).json({ 
                message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (totalAmount * coupon.discountAmount) / 100;
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        } else {
            discount = coupon.discountAmount;
        }

        // Update cart with coupon
        cart.totalAfterDiscount = totalAmount - discount;
        cart.coupon = {
            code: coupon.code,
            discount: discount,
            discountType: coupon.discountType
        };

        await cart.save();
        
        res.json({
            success: true,
            totalAfterDiscount: cart.totalAfterDiscount,
            coupon: cart.coupon
          });

    } catch (error) {
        console.error('Coupon Error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

module.exports = router;