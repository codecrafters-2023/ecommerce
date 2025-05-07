require('./models/index');
const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const adminUserList = require('./routes/adminUserList')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoute')
const adminDashboardRoutes = require('./routes/adminDashboard');
const couponRoutes = require('./routes/CoupenRoutes')
const galleryRoutes = require('./routes/Gallery')
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control'],
    exposedHeaders: ['Authorization', 'Content-Disposition'],

}));

// Database
connectDB();

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//     // Set static folder
//     app.use(express.static('frontend/build'));

//     // Handle React routing - return all requests to React app
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//     });
// }

// app.use('/' , (req, res) => {
//     res.send('API is running...');
// });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/userlist', adminUserList);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/gallery', galleryRoutes);

const PORT = 8080 || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));