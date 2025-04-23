const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Products');


const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    }
    return days;
};

const getLast12Months = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
    return months;
};

router.get('/dashboard', async (req, res) => {
    try {
        const { filter } = req.query;

        const stats = {
            users: await User.countDocuments(),
            orders: await Order.countDocuments(),
            cancelledOrders: await Order.countDocuments({ status: 'cancelled' }),
            products: await Product.countDocuments(),
            revenue: (await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalAmount" }
                    }
                }
            ]))[0]?.total || 0 // Extract numeric value
        };

        const chartData = {
            labels: filter === 'daily' ? getLast30Days() : getLast12Months(),
            datasets: [{
                label: 'Orders',
                data: [], // Add your actual order data
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        };

        res.json({ stats, chartData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;