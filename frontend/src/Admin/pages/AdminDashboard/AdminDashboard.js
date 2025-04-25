import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminSidebar from '../../components/Navbar';
import './index.css';
Chart.register(...registerables);

const AdminDashboard = () => {
    const [filter, setFilter] = useState('monthly');
    const [stats, setStats] = useState({
        users: { current: 0, previous: 0 },
        orders: { current: 0, previous: 0 },
        cancelledOrders: { current: 0, previous: 0 },
        products: { current: 0, previous: 0 },
        revenue: { current: 0, previous: 0 }
    });




    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    // Fetch data from your backend API
    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/admin/dashboard?filter=${filter}`
                );
                const data = await response.json();
                setStats(data.stats);
                setChartData(data.chartData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling (refresh every 5 seconds)
        intervalId = setInterval(fetchData, 5000);

        // Cleanup function
        return () => clearInterval(intervalId);
    }, [filter]);

    return (
        <>
            <div className="admin-dashboard">
                <AdminSidebar />

                <main className="dashboard-main">
                    <header className="dashboard-header">
                        <h1 className="dashboard-title">Analytics Overview</h1>
                        <div className="filter-controls">
                            <select className="time-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="daily">Last 7 Days</option>
                                <option value="monthly">Last 30 Days</option>
                            </select>
                        </div>
                    </header>

                    <div className="metrics-grid">
                        <MetricCard
                            title="Total Users"
                            metricData={stats.users}
                            icon="👤"
                            variant="blue"
                        />
                        <MetricCard
                            title="Total Orders"
                            metricData={stats.orders}
                            icon="📦"
                            variant="purple"
                        />
                        <MetricCard
                            title="Cancelled Orders"
                            metricData={stats.cancelledOrders}
                            icon="❌"
                            variant="red"
                        />
                        <MetricCard
                            title="Total Products"
                            metricData={stats.products}
                            icon="🛍️"
                            variant="green"
                        />
                        <MetricCard
                            title="Total Revenue"
                            metricData={stats.revenue}
                            icon="💰"
                            variant="orange"
                        />

                    </div>

                    <div className="visualization-section">
                        <div className="chart-card">
                            <h3>Order Trends</h3>
                            <div className="chart-wrapper">
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Product Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

const MetricCard = ({ title, metricData = { current: 0, previous: 0 }, icon, variant }) => {
    const calculateTrend = () => {
        // Handle static metrics first
        if (['user', 'product'].some(word => title.toLowerCase().includes(word))) {
            if (metricData.previous === 0 && metricData.current > 0) return 100;
            if (metricData.previous === 0) return 0;
            return ((metricData.current - metricData.previous) / metricData.previous) * 100;
        }
    
        // Original logic for orders/revenue
        if (metricData.previous === 0 && metricData.current > 0) return Infinity;
        if (metricData.previous === 0) return 0;
        return ((metricData.current - metricData.previous) / metricData.previous) * 100;
    };

    const isStaticMetric = ['user', 'product'].some(word => 
        title.toLowerCase().includes(word)
    );

    const formatValue = () => {
        if (title.includes('Revenue')) {
            return `₹${metricData.current?.toLocaleString('en-IN') || 0}`;
        }
        return metricData.current;
    };

    const trend = calculateTrend();
    const isNew = trend === Infinity;
    const isPositive = trend > 0 || isNew;

    return (
        <div className={`metric-card ${variant}`}>
            <div className="metric-content">
                <div className="metric-icon">{icon}</div>
                <div className="metric-info">
                    <span className="metric-title">{title}</span>
                    <h2 className="metric-value">
                        {isStaticMetric ? 
                            metricData.current : 
                            title.includes('Revenue') ? 
                                `₹${metricData.current?.toLocaleString()}` : 
                                metricData.current
                        }
                    </h2>
                </div>
            </div>
            <div className={`metric-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                {metricData.previous === 0 && metricData.current > 0 ? (
                    <span className="new-indicator">+100% ↑</span>
                ) : (
                    <>
                        {Math.abs(trend.toFixed(0))}%
                        <span className="trend-arrow">
                            {trend >= 0 ? '↑' : '↓'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
