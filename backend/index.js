const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    // origin: process.env.CLIENT_URL || 'http://localhost:3000',
    origin: "*",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization"
}));

// Database
connectDB();

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));

    // Handle React routing - return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = 8080 || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));