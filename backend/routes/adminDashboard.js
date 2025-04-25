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
        const now = new Date();

        // Accurate date range calculation
        const getDateRange = (daysBack, durationDays) => {
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() - daysBack);
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - durationDays);
            return { $gte: startDate, $lt: endDate };
        };

        // Period configuration
        const periodConfig = {
            daily: { currentDays: 0, previousDays: 7, duration: 7 },
            monthly: { currentDays: 0, previousDays: 30, duration: 30 }
        };

        const { currentDays, previousDays, duration } = periodConfig[filter] || periodConfig.monthly;

        // Universal data fetcher
        const getAccurateData = async (model, match = {}) => {
            // Remove date filters for users/products
            if (model.modelName === 'User' || model.modelName === 'Product') {
                const count = await model.countDocuments(match);
                return { current: count, previous: 0 }; // Basic count for non-order metrics
            }

            // Keep date logic for orders/revenue
            const [current, previous] = await Promise.all([
                model.countDocuments({
                    ...match,
                    createdAt: getDateRange(currentDays, duration)
                }),
                model.countDocuments({
                    ...match,
                    createdAt: getDateRange(previousDays, duration)
                })
            ]);
            return { current, previous };
        };

        // Accurate revenue calculation
        const getAccurateRevenue = async (match = {}) => {
            const aggregation = async (daysBack, duration) => {
                const result = await Order.aggregate([
                    { $match: { ...match, createdAt: getDateRange(daysBack, duration) } },
                    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                ]);
                return result[0]?.total || 0;
            };

            return {
                current: await aggregation(currentDays, duration),
                previous: await aggregation(previousDays, duration)
            };
        };

        const calculateDateRanges = (baseDate, daysBack, duration) => {
            const endDate = new Date(baseDate);
            endDate.setDate(endDate.getDate() - daysBack);
            
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - duration);
            
            return { start: startDate, end: endDate };
        };

        const stats = {
            users: {
                current: await User.countDocuments(), 
                previous: 0 // Disable trend
            },
            
            // Products: Total count without date filters
            products: {
                current: await Product.countDocuments(),
                previous: 0 // Disable trend
            },
            orders: await getAccurateData(Order, {
                status: { $ne: 'cancelled' },
                deletedAt: { $exists: false }
            }),
            cancelledOrders: await getAccurateData(Order, { status: 'cancelled' }),
            revenue: await getAccurateRevenue({
                status: { $ne: 'cancelled' },
                deletedAt: { $exists: false }
            })
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