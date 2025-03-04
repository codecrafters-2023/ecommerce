const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Products')

// Get user's cart
router.get('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (error) {
        console.error('Cart Fetch Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart'
        });
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

module.exports = router;