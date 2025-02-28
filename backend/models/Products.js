// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String },
//     // category: { type: String },
//     images: [{
//         url: { type: String, required: true },
//         publicId: { type: String, required: true }
//       }], // URL of the image
// }, { timestamps: true });


// module.exports = mongoose.model('eproducts', productSchema);

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['electronics', 'fashion', 'home', 'other']
  },
  brand: {
    type: String,
    // required: [true, 'Product brand is required']
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  colors: [{
    type: String,
    enum: ['red', 'blue', 'black', 'white', 'green']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('eproducts', productSchema);