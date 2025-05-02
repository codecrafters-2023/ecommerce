// OrderSuccess.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import './OrderSuccess.css';
import axios from 'axios';
import Header from '../header';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(location.state?.order);
    const [loading, setLoading] = useState(!location.state?.order);

    // const handleDownloadInvoice = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             alert('Please login to download invoice');
    //             return navigate('/login');
    //         }

    //         const response = await axios.get(
    //             `${process.env.REACT_APP_API_URL}/orders/${order._id}/invoice`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 },
    //                 responseType: 'blob',
    //                 timeout: 15000
    //             }
    //         );

    //         // Verify blob integrity
    //         if (!response.data || response.data.size === 0) {
    //             throw new Error('Empty PDF response');
    //         }

    //         // Create download
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `invoice-${order._id}.pdf`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         URL.revokeObjectURL(url);

    //     } catch (error) {
    //         console.error('[Invoice Download] Error:', {
    //             status: error.response?.status,
    //             data: error.response?.data,
    //             orderId: order?._id
    //         });
    //         alert(error.response?.data?.message || 'Invoice download failed');
    //     }
    // };

    useEffect(() => {
        if (!location.state?.order) {
            // If page is refreshed, attempt to fetch last order
            const fetchLatestOrder = async () => {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/orders/latest`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setOrder(data);
                } catch (error) {
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            };
            fetchLatestOrder();
        }
    }, [navigate, location.state]);

    if (loading) return <div className="loading">Loading order details...</div>;
    if (!order) return <div className="error">No order found</div>;

    if (!order) return <div className="loading">Loading order details...</div>;

    return (
        <>
            <Header />
            <div className="order-success-container">
                <div className="success-header">
                    <div className="success-icon">
                        <FaCheckCircle style={{fontSize:"30px"}}/>
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p className="confirmation-text">
                        A confirmation email has been sent to {order.shippingAddress.email}
                    </p>
                </div>

                <div className="order-dashboard">
                    {/* <div className="order-timeline">
                        <div className="timeline-step active">
                            <FaBox className="timeline-icon" />
                            <span>Order Placed</span>
                        </div>
                        <div className="timeline-step">
                            <FaShippingFast className="timeline-icon" />
                            <span>Shipped</span>
                        </div>
                        <div className="timeline-step">
                            <FaCheckCircle className="timeline-icon" />
                            <span>Delivered</span>
                        </div>
                    </div> */}

                    <div className="order-details-grid">
                        <div className="order-summary">
                            <h2><FaBox /> Order Summary</h2>
                            <div className="summary-item">
                                <span>Order Number:</span>
                                <span>#{order._id}</span>
                            </div>
                            <div className="summary-item">
                                <span>Order Date:</span>
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>Total Amount:</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="shipping-details">
                            <h2><FaShippingFast /> Shipping Details</h2>
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>PIN: {order.shippingAddress.zip}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                        </div>

                        <div className="order-items">
                            <h2><FaCreditCard /> Order Items</h2>
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    {/* <img src={item.image?.url} alt={item.name} /> */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        // className="product-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling?.classList.add('show-fallback');
                                        }}
                                    />
                                    <h4>{item.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₹{(item.discountPrice || item.price).toFixed(2)}</p>
                                    <div className="item-info">
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-actions">
                        <Link to="/shop" className="continue-shopping">
                            Continue Shopping
                        </Link>
                        {/* <button
                            className="download-invoice"
                            onClick={handleDownloadInvoice}
                        >
                            Download Invoice
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;