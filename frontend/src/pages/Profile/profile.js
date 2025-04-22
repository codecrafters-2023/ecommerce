// import React, { useState } from "react";
// import { FaCloudUploadAlt, FaUserCircle } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";
// import Header from "../../components/header";
// import axios from "axios"
// import "./index.css"
// import { toast } from "react-toastify";

// const Profile = () => {
//   const { user } = useAuth(); // Assuming you have updateUser function in AuthContext
//   const [formData, setFormData] = useState({
//     fullName: user?.fullName,
//     email: user?.email,
//     phone: user?.phone || '',
//     password: '',
//     confirmPassword: '',
//     avatar: null
//   });


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const isValidPassword = (password) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;
//     return regex.test(password);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, avatar: file });
//       // setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (id) => {


//     if (formData.password || formData.confirmPassword) {
//       if (formData.password !== formData.confirmPassword) {
//         toast.error("Passwords don't match!");
//         return;
//       }

//       if (!isValidPassword(formData.password)) {
//         toast.error('Password must be at least 10 characters long and include one uppercase letter, one lowercase letter, and one special character.');
//         return;
//       }
//     }

//     const data = new FormData();
//     data.append('fullName', formData.fullName);
//     data.append('email', formData.email);
//     data.append('phone', formData.phone);
//     if (formData.password) {
//       data.append('password', formData.password);
//     }
//     if (formData.avatar) {
//       data.append('avatar', formData.avatar);
//     }


//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/auth/userUpdate/${id}`,
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       // updateUser(response.data);
//       console.log(response.data);

//       toast.success('Profile updated successfully!');
//       setFormData(prev => ({ ...prev, password: '' })); // Clear password field
//     } catch (error) {
//       console.error('Update failed:', error);
//       toast.error(error.response?.data?.message || 'Update failed');
//     }
//   };

//   return (
//     <div >
//       <Header />
//       <div className="profile-content">
//         <div className="profile-card">
//           {/* Profile Header */}
//           <div className="profile-header">
//             <img
//               src={user?.avatar}
//               alt={user?.fullName}
//               className="profile-avatar"
//               style={{ width: '20%', borderRadius: "50%" }}
//             />
//             <label htmlFor="avatar">
//               <div className="upload-overlay">
//                 <FaCloudUploadAlt className="upload-icon" />
//                 <span>Change Avatar</span>
//               </div>
//               <input
//                 type="file"
//                 id="avatar"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 hidden
//               />
//             </label>
//             {/* <FaUserCircle className="profile-icon" /> */}
//             <h2 className="profile-name">{user?.fullName}</h2>
//           </div>

//           <div className="divider"></div>

//           {/* Profile Form */}
//           <div className="profile-form">
//             <div className="form-group">
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData?.fullName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData?.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone</label>
//               <input
//                 type="number"
//                 name="phone"
//                 value={formData?.phone}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="••••••••"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Confirm New Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="••••••••"
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" className="btn save-btn" onClick={() => handleSubmit(user._id)}>
//               Save Changes
//             </button>
//           </div>

//           <div className="divider"></div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios";
import "./index.css";
import { toast } from "react-toastify";
import { FiEdit, FiPackage } from "react-icons/fi";

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

  return (
    <div className="profile-container">
      <Header />
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
                              <div className="order-actions">
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteOrder(order._id)}
                                >
                                  Delete Order
                                </button>
                              </div>
                            ) : (
                              order.status === 'pending' && (
                                <button
                                  className="cancel-btn"
                                  onClick={() => handleCancelOrder(order._id)}
                                >
                                  Cancel Order
                                </button>
                              )
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
  );
};

export default Profile;