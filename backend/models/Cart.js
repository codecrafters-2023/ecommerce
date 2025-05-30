const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        url: String,
        publicId: String
    }],
    name: {
        type: String,
        required: true
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalAfterDiscount: Number,
    coupon: {
        code: String,
        discount: Number,
        discountType: String
    }
});

module.exports = mongoose.model('Cart', cartSchema);