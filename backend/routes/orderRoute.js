const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Products');
const { protect, admin } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

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
        // const itemsWithImages = await Promise.all(items.map(async item => {
        //     const product = await Product.findById(item.productId);
        //     if (!product) throw new Error(`Product ${item.productId} not found`);

        //     return {
        //         ...item,
        //         image: product.images[0]?.url || ''
        //     };
        // }));

        const itemsWithDetails = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.productId || item.product);
            if (!product) throw new Error(`Product ${item.productId} not found`);

            return {
                ...item,
                price: product.discountPrice || product.price,
                image: product.images[0]?.url || '' // Add image from product data
            };
        }));

        // 2. Calculate actual subtotal
        const subtotal = itemsWithDetails.reduce((sum, item) =>
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
            items: itemsWithDetails.map(item => ({ // Use itemsWithDetails here
                productId: item.productId || item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image // Now included
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
        console.error('Order Creation Error:', {
            error: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({
            success: false,
            message: "Order processing failed. Please contact support.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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




// orderRoute.js - Updated Invoice Endpoint
// router.get('/:id/invoice', protect, async (req, res) => {
//     try {

//         if (mongoose.connection.readyState !== 1) {
//             return res.status(503).json({ message: 'Database not connected' });
//         }
//         // 1. Fetch order with safety checks
//         const order = await Order.findById(req.params.id)
//             .populate({
//                 path: 'user',
//                 select: '_id name email',
//                 model: 'User'
//             })
//             .populate({
//                 path: 'items.productId',
//                 select: 'name price',
//                 model: 'eproducts',
//                 options: { lean: true }
//             })
//             .lean();

//         // 2. Validate order existence
//         if (!order) {
//             console.error('[Invoice] Order not found:', req.params.id);
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // 3. Authorization check
//         if (!order.user || order.user._id.toString() !== req.user._id.toString()) {
//             console.error('[Invoice] Authorization failed:', {
//                 orderUser: order.user?._id,
//                 currentUser: req.user._id
//             });
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         // 4. Initialize PDF
//         const PDFDocument = require('pdfkit');
//         const doc = new PDFDocument();

//         // 5. Error handling for PDF stream
//         doc.on('error', (err) => {
//             console.error('[PDF Stream] Error:', err);
//             if (!res.headersSent) res.status(500).json({ message: 'PDF generation failed' });
//         });

//         // 6. Set headers
//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename=invoice-${order._id}.pdf`
//         });

//         // 7. Generate PDF content
//         try {
//             // Pipe first!
//             doc.pipe(res);

//             // ======================
//             //  Design Configuration
//             // ======================
//             const colors = {
//                 primary: '#2B2D42',
//                 secondary: '#8D99AE',
//                 accent: '#EF233C',
//                 background: '#EDF2F4'
//             };

//             const spacing = {
//                 pageMargin: 40,  // Increased margin for better spacing
//                 sectionGap: 30,
//                 lineHeight: 15    // Added line height control
//             };

//             // Initialize position tracker
//             let yPosition = spacing.pageMargin;

//             // Header Section (Improved vertical spacing)
//             doc.fillColor(colors.primary)
//                 .rect(0, 0, 612, 90)  // Increased header height
//                 .fill()
//                 .fillColor('#FFF')
//                 .font('Helvetica-Bold')
//                 .fontSize(24)  // Larger font size for header
//                 .text('INVOICE', 430, 35, { align: 'right' });  // Adjusted vertical position

//             yPosition = 100;

//             // Company Details (Better line spacing)
//             doc.fillColor(colors.primary)
//                 .font('Helvetica-Bold')
//                 .fontSize(12)  // Increased font size
//                 .text('FarFoo Enterprises', spacing.pageMargin, yPosition)
//                 .font('Helvetica')
//                 .fillColor(colors.secondary)
//                 .text('GSTIN: 03AABCF0583P1Z1 | farfoo.com', spacing.pageMargin, yPosition + 20);  // Increased line spacing

//             // Invoice Meta (Improved alignment)
//             doc.fillColor(colors.primary)
//                 .font('Helvetica-Bold')
//                 .fontSize(12)
//                 .text(`Invoice #: ${order._id}`, 450, yPosition)
//                 .font('Helvetica')
//                 .fillColor(colors.secondary)
//                 .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 450, yPosition + 50);

//             yPosition += 80;  // Increased section gap

//             // Bill To Section (Dynamic height calculation)
//             const billToLines = [
//                 order.shippingAddress.name,
//                 order.shippingAddress.address,
//                 `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`
//             ];

//             doc.fillColor(colors.primary)
//                 .font('Helvetica-Bold')
//                 .fontSize(14)  // Larger font for section header
//                 .text('BILL TO:', spacing.pageMargin, yPosition);

//             billToLines.forEach((line, index) => {
//                 doc.font('Helvetica')
//                     .fillColor(colors.secondary)
//                     .text(line, spacing.pageMargin, yPosition + 25 + (index * spacing.lineHeight));
//             });

//             // Payment Status (Better positioning)
//             doc.fillColor(colors.accent)
//                 .font('Helvetica-Bold')
//                 .fontSize(14)
//                 .text(order.paymentStatus.toUpperCase(), 450, yPosition + 25, {
//                     align: 'right',
//                     underline: false  // Removed underline for cleaner look
//                 });

//             yPosition += 25 + (billToLines.length * spacing.lineHeight) + spacing.sectionGap;

//             // Items Table (Improved column widths and spacing)
//             const tableConfig = {
//                 headers: ['DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL'],
//                 rows: order.items.map(item => [
//                     item.productId?.name || 'Product',
//                     item.quantity.toString(),
//                     `₹${item.price.toFixed(2)}`,
//                     `₹${(item.price * item.quantity).toFixed(2)}`
//                 ]),
//                 columnWidths: [340, 60, 90, 90],  // Adjusted column widths
//                 rowHeight: 20  // Explicit row height
//             };

//             // Table Header (Improved padding)
//             doc.fillColor(colors.primary)
//                 .rect(spacing.pageMargin, yPosition, 532, 25)  // Increased header height
//                 .fill()
//                 .fillColor('#FFF')
//                 .font('Helvetica-Bold')
//                 .fontSize(12);  // Larger header font

//             let xPosition = spacing.pageMargin;
//             tableConfig.headers.forEach((header, index) => {
//                 doc.text(header, xPosition + 10, yPosition + 7);  // Added horizontal padding
//                 xPosition += tableConfig.columnWidths[index];
//             });

//             yPosition += 30;  // Space after header

//             // Table Rows (Dynamic row positioning)
//             doc.fillColor(colors.primary)
//                 .font('Helvetica')
//                 .fontSize(11);  // Slightly larger font for readability

//             order.items.forEach((item, rowIndex) => {
//                 xPosition = spacing.pageMargin;
//                 tableConfig.rows[rowIndex].forEach((cell, cellIndex) => {
//                     doc.text(cell, xPosition + 10, yPosition + 5);  // Added cell padding
//                     xPosition += tableConfig.columnWidths[cellIndex];
//                 });
//                 yPosition += tableConfig.rowHeight;
//             });

//             yPosition += 40;  // Space after table

//             // Total Section (Improved prominence)
//             doc.fillColor(colors.accent)
//                 .font('Helvetica-Bold')
//                 .fontSize(16)  // Larger font for total
//                 .text('GRAND TOTAL', 400, yPosition)
//                 .text(`₹${order.totalAmount.toFixed(2)}`, 500, yPosition, {
//                     align: 'right',
//                     underline: true  // Added underline for emphasis
//                 });

//             yPosition += 50;  // Space before footer

//             // Footer (Better readability)
//             doc.fillColor(colors.secondary)
//                 .font('Helvetica')
//                 .fontSize(10)  // Increased footer font size
//                 .text('Thank you for your business!', spacing.pageMargin, yPosition, {
//                     align: 'center',
//                     lineBreak: false
//                 })
//                 .text('Terms: Payment due within 15 days | Late payments subject to 1.5% monthly interest',
//                     spacing.pageMargin, yPosition + 15, {
//                     align: 'center',
//                     lineBreak: false
//                 });


//         } catch (contentError) {
//             console.error('[PDF Content] Error:', contentError);
//             if (!res.headersSent) return res.status(500).json({ message: 'Content generation failed' });
//         }

//         // 8. Finalize
//         doc.end();

//     } catch (error) {
//         console.error('[Invoice Route] Critical Error:', {
//             error: error.message,
//             stack: error.stack,
//             params: req.params
//         });
//         res.status(500).json({
//             message: 'Invoice generation failed',
//             ...(process.env.NODE_ENV === 'development' && { debug: error.message })
//         });
//     }
// });


module.exports = router;