import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrders.css';
import AdminSidebar from '../../components/Navbar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/orders/getOrders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // console.log(data, 'orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateStatus = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/orders/orders/${selectedOrder._id}`,
                { status },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/orders/orders/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setOrders(orders.filter(order => order._id !== id));
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    return (
        <>
            <AdminSidebar />
            <div className="admin-orders">
                <div className="orders-header">
                    <h1>Order Management</h1>
                </div>

                <div className="orders-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td className="order-id">
                                        <span className="truncate-id">#{order._id.slice(-6)}</span>
                                    </td>
                                    <td>
                                        <div className="user-info">
                                            <span className="user-name">{order.user?.name}</span>
                                            <span className="user-email">{order.user?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="items-list">
                                            {order.items.map(item => (
                                                <div key={item.productId} className="item-row">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-qty">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="total-amount">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button
                                                className="btn edit-btn"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setStatus(order.paymentStatus);
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                className="btn delete-btn"
                                                onClick={() => deleteOrder(order._id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedOrder && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Update Order Status</h2>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                            <div className="modal-actions">
                                <button
                                    className="btn cancel-btn"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn edit-btn"
                                    onClick={updateStatus}
                                >
                                    Confirm Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminOrders;