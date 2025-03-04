const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user and check existence
        const user = await User.findById(decoded.id).select('-password -tokens');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists'
            });
        }

        // Check if user changed password after token was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'Password was recently changed! Please log in again'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        // Handle specific JWT errors
        let message = 'Not authorized, token failed';
        if (error.name === 'TokenExpiredError') {
            message = 'Session expired, please log in again';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token, please log in again';
        }

        console.error('Authentication error:', error.message);
        res.status(401).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const admin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin privileges required'
        });
    }
    next();
};

module.exports = { protect, admin };