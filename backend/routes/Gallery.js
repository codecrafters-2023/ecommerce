// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const Gallery = require('../models/Gallery');
const { protect, admin } = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;

// Admin route to upload image
router.post('/upload', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const image = new Gallery({
            title: req.body.title,
            filename: req.file.filename,
            path: req.file.path
        });
        await image.save();
        res.status(201).json(image);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Admin route to delete image
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) return res.status(404).json({ error: 'Image not found' });

        // Extract public ID from Cloudinary URL
        const publicId = image.path.split('/').slice(-2).join('/').split('.')[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Delete from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Error deleting image' });
    }
});

// Public route to get all images
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ uploadedAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;