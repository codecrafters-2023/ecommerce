const express = require('express');
const router = express.Router();
const Product = require('../models/Products')

// Get filtered products
router.get('/getAllProducts', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        const query = {};

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.$or = [
                {
                    discountPrice: {
                        ...(minPrice && { $gte: parseFloat(minPrice) }),
                        ...(maxPrice && { $lte: parseFloat(maxPrice) })
                    }
                },
                {
                    price: {
                        ...(minPrice && { $gte: parseFloat(minPrice) }),
                        ...(maxPrice && { $lte: parseFloat(maxPrice) })
                    }
                }
            ];
        }

        // Sorting
        const sortOptions = {
            'price-asc': { discountPrice: 1 },
            'price-desc': { discountPrice: -1 },
            'newest': { createdAt: -1 },
            'popular': { rating: -1 }
        };
        const sortBy = sortOptions[sort] || { createdAt: -1 };

        // Pagination
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            products,
            totalProducts: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// Get unique categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});


router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;