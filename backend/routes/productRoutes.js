const express = require('express');
const router = express.Router();
const Product = require('../models/Products')
const upload = require('../middleware/multer')
const { cloudinary } = require('../config/cloudinary');


// Create product with images
router.post('/addProducts', upload.array('images'), async (req, res) => {
    try {
        // Verify files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        // Extract Cloudinary URLs
        const imageUrls = req.files.map(file => ({
            url: file.path,
            publicId: file.filename
        }));

        // Create product with image URLs
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            images: imageUrls
        });

        await product.save();

        res.status(201).json({
            ...product._doc,
            message: 'Product created with Cloudinary storage!'
        });

    } catch (error) {
        console.error('Cloudinary upload error:', error);

        // Cleanup uploaded files if product creation fails
        if (req.files && req.files.length > 0) {
            await Promise.all(req.files.map(file =>
                cloudinary.uploader.destroy(file.filename)
            ))
        }

        res.status(500).json({
            message: error.message || 'Failed to upload product',
            error: error.stack
        });
    }
});

// Get all products (with pagination)
router.get('/getAllProducts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
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

// Update product
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
            console.log(newImages, "images");
            
        }

        // Update other fields
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;

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
                )
            );
        }

        res.status(500).json({ message: error.message || 'Update failed' });
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