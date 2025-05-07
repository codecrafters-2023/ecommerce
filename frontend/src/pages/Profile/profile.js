import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios";
import "./index.css";
import { toast } from "react-toastify";
import { FiCheckCircle, FiDownload, FiEdit, FiHome, FiMoreVertical, FiPackage, FiTrash2, FiX, FiXCircle } from "react-icons/fi";
import Footer from "../../components/Footer/Footer";
import generateInvoice from "../../utils/pdfDesign";


const AddressModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};


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
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    email: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view orders');
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('Session expired. Please login again');
          // Add logout logic here if needed
        } else {
          toast.error(error.response?.data?.message || 'Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };


    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(response.data.addresses);
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error('Session expired. Please login again');
        } else {
          toast.error('Failed to load addresses');
        }
      }
    };

    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'addresses') fetchAddresses();

    // fetchOrders();
  }, [user, activeTab, orders]);



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

  // Address Handlers
  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/auth/addresses/${editingAddress._id}`,
          editingAddress,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Address updated');
      } else {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/auth/addresses`,
          newAddress,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Address added');
      }
      setNewAddress({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
      setEditingAddress(null);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/addresses`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAddresses(data.addresses);
      setShowAddressModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleSetPrimary = async (addressId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}/primary`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAddresses(addresses.map(addr => ({
        ...addr,
        isPrimary: addr._id === addressId
      })));
      toast.success('Primary address updated');
    } catch (error) {
      toast.error('Failed to update primary address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddress({ name: '', address: '', email: '', city: '', state: '', zip: '', phone: '' });
    setShowAddressModal(true);
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
              <button
                className={activeTab === 'addresses' ? 'active' : ''}
                onClick={() => setActiveTab('addresses')}
              >
                <FiHome /> Manage Addresses
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

              // =================== Orders List========================
            ) : activeTab === 'orders' ? (
              <div className="order-history">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                  <p className="no-orders">No orders found</p>
                ) : (
                  orders?.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-meta">
                          <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="order-status-group">
                          {
                            order.items.map(item => (
                              <img
                                src={item.image || item.productId?.image}
                                alt={item.name}
                                onError={(e) => e.target.style.display = 'none'}
                                style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                              />
                            ))
                          }

                        </div>
                      </div>

                      <div className="order-products">
                        {order.items.map(item => (
                          <div key={item.productId} className="product-item">
                            <span className="product-name">{item.name}</span>
                            <div className="dropdown">
                              <button className="dropdown-toggle">
                                <FiMoreVertical size={20} />
                              </button>
                              <div className="dropdown-menu">
                                {order.paymentStatus === 'completed' ? (
                                  <button
                                    className="dropdown-item download-btn"
                                    onClick={() => handleDownloadInvoice(order)}
                                  >
                                    <FiDownload /> Invoice
                                  </button>
                                ) : (
                                  <>
                                    {order.status === 'pending' && (
                                      <button
                                        className="dropdown-item cancel-btn"
                                        onClick={() => handleCancelOrder(order._id)}
                                      >
                                        <FiXCircle /> Cancel
                                      </button>
                                    )}
                                    {order.status === 'cancelled' && (
                                      <button
                                        className="dropdown-item delete-btn"
                                        onClick={() => handleDeleteOrder(order._id)}
                                      >
                                        <FiTrash2 /> Delete
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-total">
  <div className={`order-status ${getStatusClass(order)}`}>
    {getStatusText(order)}
  </div>
  <div>
    <strong>Total:</strong> ₹{order.totalAmount}
  </div>
</div>

                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="address-management">
                <h2>Saved Addresses</h2>
                <div className="address-save-btn-div">
                  <button className="save-btn" onClick={handleAddNewAddress}>
                    Add New Address
                  </button>
                </div>


                {/* Address List */}
                {addresses?.length === 0 ? (
                  <p className="no-orders">No saved addresses</p>
                ) : (
                  addresses?.map(address => (
                    <div key={address._id} className="order-card address-main-div">
                      <div className="order-header">
                        <span>{address.name}</span>
                        {address.isPrimary && (
                          <span className="status completed">Primary</span>
                        )}
                      </div>
                      <div className="order-details">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zip}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                      <div className="order-actions">
                        {!address.isPrimary && (
                          <button
                            className="download-btn"
                            onClick={() => handleSetPrimary(address._id)}
                          >
                            <FiCheckCircle /> Set Primary
                          </button>
                        )}
                        <button
                          className="edit-btn"
                          onClick={() => handleEditAddress(address)}
                        >
                          <FiEdit /> Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Address Modal */}
                <AddressModal show={showAddressModal} onClose={() => setShowAddressModal(false)}>
                  <div className="address-form">
                    <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={editingAddress ? editingAddress.name : newAddress.name}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, name: e.target.value })
                            : setNewAddress({ ...newAddress, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={editingAddress ? editingAddress.phone : newAddress.phone}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, phone: e.target.value })
                            : setNewAddress({ ...newAddress, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="tel"
                          value={editingAddress ? editingAddress.email : newAddress.email}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, email: e.target.value })
                            : setNewAddress({ ...newAddress, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input
                          type="text"
                          value={editingAddress ? editingAddress.address : newAddress.address}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, address: e.target.value })
                            : setNewAddress({ ...newAddress, address: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={editingAddress ? editingAddress.city : newAddress.city}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, city: e.target.value })
                            : setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={editingAddress ? editingAddress.state : newAddress.state}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, state: e.target.value })
                            : setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>ZIP Code</label>
                        <input
                          type="text"
                          value={editingAddress ? editingAddress.zip : newAddress.zip}
                          onChange={(e) => editingAddress
                            ? setEditingAddress({ ...editingAddress, zip: e.target.value })
                            : setNewAddress({ ...newAddress, zip: e.target.value })}
                        />
                      </div>

                    </div>
                    <div className="modal-actions">
                      <button className="save-btn" onClick={handleSaveAddress}>
                        {editingAddress ? 'Update Address' : 'Add Address'}
                      </button>
                      <button
                        className="cancel_btn"
                        onClick={() => setShowAddressModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </AddressModal>
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


const getStatusClass = (order) => {
  if (order.status === 'cancelled') return 'cancelled';
  return order.paymentStatus.toLowerCase();
};

const getStatusText = (order) => {
  if (order.status === 'cancelled') return 'Cancelled';
  return order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1);
};