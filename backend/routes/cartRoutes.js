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

const validateCartCoupon = async (cart) => {
    if (!cart.coupon) return cart;

    const coupon = await Coupon.findOne({ code: cart.coupon.code });
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const isValid = coupon &&
        coupon.active &&
        (!coupon.validUntil || new Date() < coupon.validUntil) &&
        (!coupon.validFrom || new Date() >= coupon.validFrom) &&
        (coupon.maxUses ? coupon.usedCount < coupon.maxUses : true) &&
        (totalAmount >= coupon.minOrderAmount);

    if (!isValid) {
        cart.coupon = undefined;
        cart.totalAfterDiscount = 0;
        await cart.save();
    }

    return cart;
};


// Get user's cart
// router.get('/', protect, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user._id })
//             .select('-__v -createdAt -updatedAt')
//             .lean();

//         const safeCart = {
//             items: cart?.items || [],
//             totalAfterDiscount: cart?.totalAfterDiscount || 0,
//             coupon: null // Force null until validated
//         };

//         if (cart?.coupon) {
//             const coupon = await Coupon.findOne({ code: cart.coupon.code });
//             if (coupon) {
//                 safeCart.coupon = { 
//                     code: coupon.code,
//                     discount: cart.coupon.discount,
//                     discountType: coupon.discountType
//                 };
//             }
//         }

//         res.json(safeCart);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch cart' });
//     }
// });

router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images discountPrice weight'); // This should work now

        // If no cart exists, return empty cart
        if (!cart) {
            return res.json({
                items: [],
                totalAfterDiscount: 0,
                coupon: null
            });
        }

        // Calculate total after discount
        let totalAfterDiscount = cart.totalAfterDiscount || 0;

        // If not already calculated, calculate it
        if (!totalAfterDiscount && cart.items && cart.items.length > 0) {
            totalAfterDiscount = cart.items.reduce((total, item) => {
                const price = item.product?.price || item.price || 0;
                const quantity = item.quantity || 1;
                return total + (price * quantity);
            }, 0);
        }

        res.json({
            items: cart.items || [],
            totalAfterDiscount: totalAfterDiscount,
            coupon: cart.coupon || null
        });
    } catch (error) {
        console.error('Error fetching cart:', error);

        // Return empty cart on error
        res.json({
            items: [],
            totalAfterDiscount: 0,
            coupon: null
        });
    }
});


// Add to cart
// router.post('/', protect, async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         let cart = await Cart.findOne({ user: req.user._id });

//         if (!cart) {
//             cart = new Cart({ user: req.user._id, items: [] });
//         }

//         const existingItem = cart.items.find(item => item.product.toString() === productId);

//         if (existingItem) {
//             existingItem.quantity += Number(quantity);
//             // Update price if it's changed
//             existingItem.price = product.discountPrice || product.price;
//         } else {
//             cart.items.push({
//                 product: productId,
//                 name: product.name,
//                 price: product.discountPrice || product.price,
//                 images: product.images,
//                 quantity: Number(quantity)
//             });
//         }

//         await cart.save();
//         await validateCartCoupon(cart);
//         res.status(201).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        console.log('Adding to cart for user:', userId, 'product:', productId);

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find existing cart for user
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({
                user: userId,
                items: [],
                totalAfterDiscount: 0
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if item already exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item with product details
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.discountPrice || product.price,
                name: product.name,
                images: product.images || []
            });
        }

        // Recalculate total
        cart.totalAfterDiscount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Save cart
        await cart.save();

        // Return cart with populated product info (optional)
        // But we already have the details in the item, so we don't need to populate
        res.json({
            success: true,
            message: 'Product added to cart',
            cart: {
                items: cart.items,
                totalAfterDiscount: cart.totalAfterDiscount,
                coupon: cart.coupon || null
            }
        });

    } catch (error) {
        console.error('Error adding to cart:', error);

        // Handle duplicate key error (if unique constraint still exists)
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Cart already exists. Please try again.'
            });
        }

        // Handle missing schema error
        if (error.name === 'MissingSchemaError') {
            return res.status(500).json({
                message: 'Server configuration error. Product model not found.'
            });
        }

        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/cart/clean-duplicates - Clean duplicate cart items
router.post('/clean-duplicates', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    let cleanedCount = 0;

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.json({
        success: true,
        message: 'No cart found or cart is empty',
        cleanedCount: 0
      });
    }

    // Create a map to track product quantities
    const productMap = new Map();
    const itemsToRemove = [];

    cart.items.forEach((item, index) => {
      // Extract product ID
      let productId;
      if (item.product && item.product._id) {
        productId = item.product._id.toString();
      } else if (typeof item.product === 'string') {
        productId = item.product;
      } else if (item.productId) {
        productId = item.productId;
      }

      if (!productId) {
        console.log('Skipping item with no product ID:', item);
        return;
      }

      if (productMap.has(productId)) {
        // Merge with existing
        const existingIndex = productMap.get(productId);
        cart.items[existingIndex].quantity += item.quantity;
        itemsToRemove.push(index);
        cleanedCount++;
      } else {
        productMap.set(productId, index);
      }
    });

    // Remove duplicate items
    itemsToRemove.sort((a, b) => b - a).forEach(index => {
      cart.items.splice(index, 1);
    });

    // Recalculate total
    cart.totalAfterDiscount = cart.items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);

    // If coupon exists, recalculate discount
    if (cart.coupon) {
      const totalAmount = cart.totalAfterDiscount;
      const coupon = await Coupon.findOne({ code: cart.coupon.code });
      
      if (coupon) {
        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (totalAmount * coupon.discountAmount) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else {
          discount = coupon.discountAmount;
        }
        
        cart.coupon.discount = discount;
        cart.totalAfterDiscount = totalAmount - discount;
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: `Cleaned ${cleanedCount} duplicate items`,
      cleanedCount: cleanedCount
    });
  } catch (error) {
    console.error('Error cleaning duplicates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error cleaning duplicates' 
    });
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
        await validateCartCoupon(cart);
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
        await validateCartCoupon(cart);

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

router.delete('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    items: [],
                    totalAfterDiscount: 0,
                    coupon: null
                }
            },
            { new: true }
        );
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

router.post('/reset', protect, async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    items: [],
                    totalAfterDiscount: 0,
                    coupon: null
                }
            },
            { new: true, upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Cart reset failed' });
    }
});

router.post('/simple', protect, async (req, res) => {
    try {
        const { productId, quantity = 1, productDetails } = req.body;
        const userId = req.user.id;

        console.log('Adding to cart via simple endpoint:', { productId, quantity });

        // Find existing cart for user
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalAfterDiscount: 0
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if item already exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item with provided product details
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: productDetails?.price || 0,
                name: productDetails?.name || 'Product',
                images: productDetails?.images || []
            });
        }

        // Recalculate total
        cart.totalAfterDiscount = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await cart.save();

        res.json({
            success: true,
            message: 'Product added to cart'
        });

    } catch (error) {
        console.error('Error in simple cart add:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to cart'
        });
    }
});

module.exports = router;