import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import AdminSidebar from '../../components/Navbar';
import './index.css';
Chart.register(...registerables);

const AdminDashboard = () => {
    const [filter, setFilter] = useState('monthly');
    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        products: 0,
        revenue: 0
    });

    console.log(stats.revenue.total);


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    // Fetch data from your backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/dashboard?filter=${filter}`);
                const data = await response.json();
                setStats(data.stats);
                setChartData(data.chartData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
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
                            value={stats.users}
                            trend={12.5}
                            icon="👤"
                            variant="blue"
                        />
                        <MetricCard
                            title="Total Orders"
                            value={stats.orders}
                            trend={-3.2}
                            icon="📦"
                            variant="purple"
                        />
                        <MetricCard
                            title="Cancelled Orders"
                            value={stats.cancelledOrders}
                            trend={-2.1} // Calculate based on your business logic
                            icon="❌"
                            variant="red"
                        />
                        <MetricCard
                            title="Available Products"
                            value={stats.products}
                            trend={8.7}
                            icon="🛍️"
                            variant="green"
                        />
                        <MetricCard
                            title="Total Revenue"
                            value={stats.revenue?.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'INR'
                            })}
                            trend={18.4}
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

const MetricCard = ({ title, value, trend, icon, variant }) => (
    <div className={`metric-card ${variant}`}>
        <div className="metric-content">
            <div className="metric-icon">{icon}</div>
            <div className="metric-info">
                <span className="metric-title">{title}</span>
                <h2 className="metric-value">{value}</h2>
            </div>
        </div>
        <div className={`metric-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
    </div>
);

export default AdminDashboard;
