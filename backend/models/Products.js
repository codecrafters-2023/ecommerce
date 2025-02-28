const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    // category: { type: String },
    images: [{
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }], // URL of the image
}, { timestamps: true });


module.exports = mongoose.model('eproducts', productSchema);