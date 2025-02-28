const { storage } = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
        files: 5 // Max 5 files
    }
});

module.exports = upload;