import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios";
import "./index.css";
import { toast } from "react-toastify";
import { FiEdit, FiPackage } from "react-icons/fi";
import Footer from "../../components/Footer/Footer";
import generateInvoice from "../../utils/pdfDesign";



const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(error.response?.data?.message || 'Failed to load orders');
      }
    };
    fetchOrders();
  }, [user, activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (id) => {
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }
      if (!isValidPassword(formData.password)) {
        toast.error('Password must be at least 10 characters with uppercase, lowercase, and special character');
        return;
      }
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/userUpdate/${id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`, {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Update local state
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Remove from local state
      setOrders(orders.filter(order => order._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
    }
  };

  // Update download handler
  const handleDownloadInvoice = (order) => {
    if (order.paymentStatus === 'completed') {
      generateInvoice(order);
    } else {
      toast.error('Invoice available only for completed orders');
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="user-initials">
                {user?.fullName?.split(' ').map(n => n[0]).join('')}
              </div>
              <h2>{user?.fullName}</h2>
              <p>{user?.email}</p>
            </div>
            <nav className="profile-nav">
              <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                <FiEdit /> Edit Profile
              </button>
              <button
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => setActiveTab('orders')}
              >
                <FiPackage /> Order History
              </button>
            </nav>
          </div>

          <div className="profile-content">
            {activeTab === 'profile' ? (
              <div className="profile-form-container">
                <h2>Account Settings</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  className="save-btn"
                  onClick={() => handleSubmit(user._id)}
                >
                  Update Profile
                </button>
              </div>
            ) : (
              <div className="order-history">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                  <p className="no-orders">No orders found</p>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                        <span className={`status ${order.paymentStatus}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="order-details">
                        <div>
                          <strong>Date:</strong>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Total:</strong> ₹{order.totalAmount}
                        </div>
                      </div>
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.productId} className="order-item">
                            <div className="item-image">
                              <img
                                src={item.image || item.productId?.image}
                                alt={item.name}
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            </div>
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                            <span>₹{item.price}</span>

                            <div className="order-actions">
                              {order.status === 'cancelled' ? (
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteOrder(order._id)}
                                >
                                  Delete
                                </button>
                              ) : (
                                order.status === 'pending' && (
                                  <button
                                    className="cancel-btn"
                                    onClick={() => handleCancelOrder(order._id)}
                                  >
                                    Cancel
                                  </button>
                                )
                              )}
                              {/* Add invoice download button */}
                              {order.paymentStatus === 'completed' && (
                                <button
                                  className="download-btn"
                                  onClick={() => handleDownloadInvoice(order)}
                                >
                                  Download Invoice
                                </button>
                              )}
                            </div>
                          </div>

                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;


