import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../../components/Navbar';
import './cancelled-orders.css';
import { FiClock, FiMail, FiUser, FiX } from 'react-icons/fi';

const CancelledOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchCancelledOrders = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/orders/cancelled`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching cancelled orders:', error);
            }
        };
        fetchCancelledOrders();
    }, [user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <AdminSidebar />
            <div className="admin_orders">
                <div className="container">
                    <div className="header">
                        <h1 className="title">Cancelled Orders</h1>
                        <div className="order-count">{orders.length} total</div>
                    </div>

                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <FiX className="empty-icon" />
                                <p className="empty-text">No cancelled orders found</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} className="list-item">
                                    <div className="order-id">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </div>

                                    <div className="user-info">
                                        <div className="user-name">
                                            {order.user?.name || order.shippingAddress?.name || 'Guest User'}
                                        </div>
                                        <div className="user-email">
                                            {order.user?.email || order.shippingAddress?.email || 'No email provided'}
                                        </div>
                                    </div>

                                    <div className="order-time">
                                        <FiClock />
                                        {formatDate(order.cancelledAt)}
                                    </div>

                                    <div className="status-badge">
                                        <FiX />
                                        Cancelled
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CancelledOrders;