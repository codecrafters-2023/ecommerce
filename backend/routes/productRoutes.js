const express = require('express');
const router = express.Router();
const Product = require('../models/Products')
const upload = require('../middleware/multer')
const { cloudinary } = require('../config/cloudinary');


// Create product
router.post('/addProducts', upload.array('images'), async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'price', 'description', 'category', 'brand'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Process images
        const images = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        // Create product object
        const productData = {
            ...req.body,
            quantity: Number(req.body.quantity) || 0,
            price: Number(req.body.price),
            discountPrice: Number(req.body.discountPrice) || undefined,
            images
        };

        // Create and save product
        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Product creation error:', error);

        // Cleanup uploaded images if error occurs
        if (req.files?.length > 0) {
            await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.destroy(file.filename)
                ))
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create product'
        });
    }
});


// Get all products (with pagination)
router.get('/getAllProducts', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        };

        const [products, totalProducts] = await Promise.all([
            Product.find(searchQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(searchQuery)
        ]);

        res.json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: error.message 
        });
    }
});

// Get single product
router.get('/getProductDetail/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// update product
router.put('/updateProduct/:id', upload.array('newImages'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image deletions
        if (req.body.deletedImages) {
            const deletedImages = JSON.parse(req.body.deletedImages);

            // Delete from Cloudinary
            await Promise.all(
                deletedImages.map(publicId =>
                    cloudinary.uploader.destroy(publicId)
                )
            );

            // Remove from product images
            product.images = product.images.filter(
                img => !deletedImages.includes(img.publicId)
            );
        }

        // Add new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                publicId: file.filename
            }));
            product.images.push(...newImages);
        }

        // Update all product fields
        product.name = req.body.name || product.name;
        product.price = Number(req.body.price) || product.price;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.brand = req.body.brand || product.brand;
        product.quantity = Number(req.body.quantity) || product.quantity;
        product.discountPrice = Number(req.body.discountPrice) || product.discountPrice;
        product.weight = Number(req.body.weight) || product.weight;
        // product.colors = req.body.colors ? JSON.parse(req.body.colors) : product.colors;

        await product.save();

        res.json({
            ...product._doc,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error(error);

        // Cleanup new images if error occurred
        if (req.files && req.files.length > 0) {
            await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.destroy(file.filename)
            ))
        }

        res.status(500).json({ 
            message: error.message || 'Update failed',
            error: error.stack 
        });
    }
});


// Delete product
router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete all images from Cloudinary
        await Promise.all(
            product.images.map(img =>
                cloudinary.uploader.destroy(img.publicId)
            ))

        await Product.deleteOne({ _id: req.params.id });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete failed' });
    }
});


module.exports = router;