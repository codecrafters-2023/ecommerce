// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import Header from "../../components/header";
// import axios from "axios";
// import "./index.css";
// import { toast } from "react-toastify";
// import { FiCheckCircle, FiDownload, FiEdit, FiHome, FiMoreVertical, FiPackage, FiTrash2, FiX, FiXCircle } from "react-icons/fi";
// import Footer from "../../components/Footer/Footer";
// import generateInvoice from "../../utils/pdfDesign";


// const AddressModal = ({ show, onClose, children }) => {
//   if (!show) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="modal-close" onClick={onClose}>
//           <FiX />
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };


// const Profile = () => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     fullName: user?.fullName,
//     email: user?.email,
//     phone: user?.phone || '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [addresses, setAddresses] = useState([]);
//   const [newAddress, setNewAddress] = useState({
//     name: '',
//     address: '',
//     email: '',
//     city: '',
//     state: '',
//     zip: '',
//     phone: ''
//   });
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         fullName: user.fullName || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         password: '',
//         confirmPassword: ''
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error('Please login to view orders');
//           return;
//         }

//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/orders/my-orders`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setOrders(response.data);
//       } catch (error) {
//         if (error.response?.status === 403) {
//           console.log('Session expired. Please login again');
//           // Add logout logic here if needed
//         } else {
//           toast.error(error.response?.data?.message || 'Failed to load orders');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };


//     const fetchAddresses = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/auth/addresses`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAddresses(response.data.addresses);
//       } catch (error) {
//         if (error.response?.status === 403) {
//           toast.error('Session expired. Please login again');
//         } else {
//           toast.error('Failed to load addresses');
//         }
//       }
//     };

//     if (activeTab === 'orders') fetchOrders();
//     if (activeTab === 'addresses') fetchAddresses();

//     // fetchOrders();
//   }, [user, activeTab, orders]);



//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isValidPassword = (password) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;
//     return regex.test(password);
//   };

//   const handleSubmit = async (id) => {
//     if (formData.password || formData.confirmPassword) {
//       if (formData.password !== formData.confirmPassword) {
//         toast.error("Passwords don't match!");
//         return;
//       }
//       if (!isValidPassword(formData.password)) {
//         toast.error('Password must be at least 10 characters with uppercase, lowercase, and special character');
//         return;
//       }
//     }

//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API_URL}/auth/userUpdate/${id}`,
//         { ...formData },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       toast.success('Profile updated successfully!');
//       setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Update failed');
//     }
//   };

//   const handleCancelOrder = async (orderId) => {
//     try {
//       await axios.put(`${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`, {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       // Update local state
//       setOrders(orders.map(order =>
//         order._id === orderId ? { ...order, status: 'cancelled' } : order
//       ));
//       toast.success('Order cancelled successfully');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Cancellation failed');
//     }
//   };

//   const handleDeleteOrder = async (orderId) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${orderId}`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       // Remove from local state
//       setOrders(orders.filter(order => order._id !== orderId));
//       toast.success('Order deleted successfully');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Deletion failed');
//     }
//   };

//   // Update download handler
//   const handleDownloadInvoice = (order) => {
//     if (order.paymentStatus === 'completed') {
//       generateInvoice(order);
//     } else {
//       toast.error('Invoice available only for completed orders');
//     }
//   };

//   // Address Handlers
//   const handleSaveAddress = async () => {
//     try {
//       if (editingAddress) {
//         await axios.put(
//           `${process.env.REACT_APP_API_URL}/auth/addresses/${editingAddress._id}`,
//           editingAddress,
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//         toast.success('Address updated');
//       } else {
//         await axios.put(
//           `${process.env.REACT_APP_API_URL}/auth/addresses`,
//           newAddress,
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//         toast.success('Address added');
//       }
//       setNewAddress({ name: '', street: '', city: '', state: '', zip: '', phone: '' });
//       setEditingAddress(null);
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API_URL}/auth/addresses`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setAddresses(data.addresses);
//       setShowAddressModal(false);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Operation failed');
//     }
//   };

//   const handleDeleteAddress = async (addressId) => {
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setAddresses(addresses.filter(addr => addr._id !== addressId));
//       toast.success('Address deleted');
//     } catch (error) {
//       toast.error('Deletion failed');
//     }
//   };

//   const handleSetPrimary = async (addressId) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}/primary`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       setAddresses(addresses.map(addr => ({
//         ...addr,
//         isPrimary: addr._id === addressId
//       })));
//       toast.success('Primary address updated');
//     } catch (error) {
//       toast.error('Failed to update primary address');
//     }
//   };

//   const handleEditAddress = (address) => {
//     setEditingAddress(address);
//     setShowAddressModal(true);
//   };

//   const handleAddNewAddress = () => {
//     setEditingAddress(null);
//     setNewAddress({ name: '', address: '', email: '', city: '', state: '', zip: '', phone: '' });
//     setShowAddressModal(true);
//   };

//   return (
//     <>
//       <Header />
//       <div className="profile-container">
//         <div className="profile-layout">
//           <div className="profile-sidebar">
//             <div className="user-info">
//               <div className="user-initials">
//                 {user?.fullName?.split(' ').map(n => n[0]).join('')}
//               </div>
//               <h2>{user?.fullName}</h2>
//               <p>{user?.email}</p>
//             </div>
//             <nav className="profile-nav">
//               <button
//                 className={activeTab === 'profile' ? 'active' : ''}
//                 onClick={() => setActiveTab('profile')}
//               >
//                 <FiEdit /> Edit Profile
//               </button>
//               <button
//                 className={activeTab === 'orders' ? 'active' : ''}
//                 onClick={() => setActiveTab('orders')}
//               >
//                 <FiPackage /> Order History
//               </button>
//               <button
//                 className={activeTab === 'addresses' ? 'active' : ''}
//                 onClick={() => setActiveTab('addresses')}
//               >
//                 <FiHome /> Manage Addresses
//               </button>
//             </nav>
//           </div>

//           <div className="profile-content">
//             {activeTab === 'profile' ? (
//               <div className="profile-form-container">
//                 <h2>Account Settings</h2>
//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label>Full Name</label>
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Email Address</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Phone Number</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>New Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="••••••••"
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Confirm Password</label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       placeholder="••••••••"
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//                 <button
//                   className="save-btn"
//                   onClick={() => handleSubmit(user._id)}
//                 >
//                   Update Profile
//                 </button>
//               </div>

//               // =================== Orders List========================
//             ) : activeTab === 'orders' ? (
//               <div className="order-history">
//                 <h2>Order History</h2>
//                 {orders.length === 0 ? (
//                   <p className="no-orders">No orders found</p>
//                 ) : (
//                   orders?.map(order => (
//                     <div key={order._id} className="order-card">
//                       <div className="order-header">
//                         <div className="order-meta">
//                           <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
//                           <span className="order-date">
//                             {new Date(order.createdAt).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </span>
//                         </div>
//                         <div className="order-status-group">
//                           {
//                             order.items.map(item => (
//                               <img
//                                 src={item.image || item.productId?.image}
//                                 alt={item.name}
//                                 onError={(e) => e.target.style.display = 'none'}
//                                 style={{ width: '50px', height: '50px', borderRadius: '5px' }}
//                               />
//                             ))
//                           }

//                         </div>
//                       </div>

//                       <div className="order-products">
//                         {order.items.map(item => (
//                           <div key={item.productId} className="product-item">
//                             <span className="product-name">{item.name}</span>
//                             <div className="dropdown">
//                               <button className="dropdown-toggle">
//                                 <FiMoreVertical size={20} />
//                               </button>
//                               <div className="dropdown-menu">
//                                 {order.paymentStatus === 'completed' ? (
//                                   <button
//                                     className="dropdown-item download-btn"
//                                     onClick={() => handleDownloadInvoice(order)}
//                                   >
//                                     <FiDownload /> Invoice
//                                   </button>
//                                 ) : (
//                                   <>
//                                     {order.status === 'pending' && (
//                                       <button
//                                         className="dropdown-item cancel-btn"
//                                         onClick={() => handleCancelOrder(order._id)}
//                                       >
//                                         <FiXCircle /> Cancel
//                                       </button>
//                                     )}
//                                     {order.status === 'cancelled' && (
//                                       <button
//                                         className="dropdown-item delete-btn"
//                                         onClick={() => handleDeleteOrder(order._id)}
//                                       >
//                                         <FiTrash2 /> Delete
//                                       </button>
//                                     )}
//                                   </>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="order-total">
//   <div className={`order-status ${getStatusClass(order)}`}>
//     {getStatusText(order)}
//   </div>
//   <div>
//     <strong>Total:</strong> ₹{order.totalAmount}
//   </div>
// </div>

//                     </div>
//                   ))
//                 )}
//               </div>
//             ) : (
//               <div className="address-management">
//                 <h2>Saved Addresses</h2>
//                 <div className="address-save-btn-div">
//                   <button className="save-btn" onClick={handleAddNewAddress}>
//                     Add New Address
//                   </button>
//                 </div>


//                 {/* Address List */}
//                 {addresses?.length === 0 ? (
//                   <p className="no-orders">No saved addresses</p>
//                 ) : (
//                   addresses?.map(address => (
//                     <div key={address._id} className="order-card address-main-div">
//                       <div className="order-header">
//                         <span>{address.name}</span>
//                         {address.isPrimary && (
//                           <span className="status completed">Primary</span>
//                         )}
//                       </div>
//                       <div className="order-details">
//                         <p>{address.street}</p>
//                         <p>{address.city}, {address.state} {address.zip}</p>
//                         <p>Phone: {address.phone}</p>
//                       </div>
//                       <div className="order-actions">
//                         {!address.isPrimary && (
//                           <button
//                             className="download-btn"
//                             onClick={() => handleSetPrimary(address._id)}
//                           >
//                             <FiCheckCircle /> Set Primary
//                           </button>
//                         )}
//                         <button
//                           className="edit-btn"
//                           onClick={() => handleEditAddress(address)}
//                         >
//                           <FiEdit /> Edit
//                         </button>
//                         <button
//                           className="delete-btn"
//                           onClick={() => handleDeleteAddress(address._id)}
//                         >
//                           <FiTrash2 /> Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}

//                 {/* Address Modal */}
//                 <AddressModal show={showAddressModal} onClose={() => setShowAddressModal(false)}>
//                   <div className="address-form">
//                     <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
//                     <div className="form-grid">
//                       <div className="form-group">
//                         <label>Full Name</label>
//                         <input
//                           type="text"
//                           value={editingAddress ? editingAddress.name : newAddress.name}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, name: e.target.value })
//                             : setNewAddress({ ...newAddress, name: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Phone</label>
//                         <input
//                           type="tel"
//                           value={editingAddress ? editingAddress.phone : newAddress.phone}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, phone: e.target.value })
//                             : setNewAddress({ ...newAddress, phone: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Email</label>
//                         <input
//                           type="tel"
//                           value={editingAddress ? editingAddress.email : newAddress.email}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, email: e.target.value })
//                             : setNewAddress({ ...newAddress, email: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>Address</label>
//                         <input
//                           type="text"
//                           value={editingAddress ? editingAddress.address : newAddress.address}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, address: e.target.value })
//                             : setNewAddress({ ...newAddress, address: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>City</label>
//                         <input
//                           type="text"
//                           value={editingAddress ? editingAddress.city : newAddress.city}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, city: e.target.value })
//                             : setNewAddress({ ...newAddress, city: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>State</label>
//                         <input
//                           type="text"
//                           value={editingAddress ? editingAddress.state : newAddress.state}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, state: e.target.value })
//                             : setNewAddress({ ...newAddress, state: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <label>ZIP Code</label>
//                         <input
//                           type="text"
//                           value={editingAddress ? editingAddress.zip : newAddress.zip}
//                           onChange={(e) => editingAddress
//                             ? setEditingAddress({ ...editingAddress, zip: e.target.value })
//                             : setNewAddress({ ...newAddress, zip: e.target.value })}
//                         />
//                       </div>

//                     </div>
//                     <div className="modal-actions">
//                       <button className="save-btn" onClick={handleSaveAddress}>
//                         {editingAddress ? 'Update Address' : 'Add Address'}
//                       </button>
//                       <button
//                         className="cancel_btn"
//                         onClick={() => setShowAddressModal(false)}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </AddressModal>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Profile;


// const getStatusClass = (order) => {
//   if (order.status === 'cancelled') return 'cancelled';
//   return order.paymentStatus.toLowerCase();
// };

// const getStatusText = (order) => {
//   if (order.status === 'cancelled') return 'Cancelled';
//   return order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1);
// };




import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Trash2, Plus, Save, X, Home, Briefcase, MapPinned, ArrowLeft, Package, Calendar, CheckCircle, XCircle, MoreVertical, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/header';
import axios from 'axios';
import { toast } from 'react-toastify';
import generateInvoice from "../../utils/pdfDesign";

export default function Profile() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(addresses);
  

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [addressData, setAddressData] = useState({
    type: 'home',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'addresses', 'orders'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Redirect if not logged in
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  // Initialize profile data
  useEffect(() => {
    if (user) {
      const nameParts = user.fullName?.split(' ') || ['', ''];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      setLoading(true);
      try {
        if (activeTab === 'addresses') {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/addresses`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const transformedAddresses = (response.data.addresses || []).map(addr => ({
            id: addr._id,
            name: addr.name || '',
            type: addr.type || 'home',
            address: addr.street || '',
            apartment: addr.apartment || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.zip || '',
            isDefault: addr.isPrimary || false
          }));
          setAddresses(transformedAddresses);
        } else if (activeTab === 'orders') {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/orders/my-orders`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrders(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setAddressData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (profileData.password) {
      if (profileData.password !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (profileData.password.length < 10) {
        newErrors.password = 'Password must be at least 10 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(profileData.password)) {
        newErrors.password = 'Password must include uppercase, lowercase, and special character';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!addressData.address.trim()) newErrors.address = 'Address is required';
    if (!addressData.city.trim()) newErrors.city = 'City is required';
    if (!addressData.state.trim()) newErrors.state = 'State is required';
    if (!addressData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(addressData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (validateProfile()) {
      try {
        const token = localStorage.getItem('token');
        const updateData = {
          fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
          phone: profileData.phone
        };

        if (profileData.password) {
          updateData.password = profileData.password;
        }

        await axios.put(
          `${process.env.REACT_APP_API_URL}/auth/userUpdate/${user._id}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Profile updated successfully!');
        setShowProfileModal(false);
        setIsEditingProfile(false);
        setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed');
      }
    }
  };

  const handleSaveAddress = async () => {
    if (validateAddress()) {
      try {
        const token = localStorage.getItem('token');
        const addressPayload = {
          type: addressData.type,
          street: addressData.address,
          apartment: addressData.apartment,
          city: addressData.city,
          state: addressData.state,
          zip: addressData.pincode,
          isPrimary: addressData.isDefault
        };

        if (editingAddressId) {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/auth/addresses/${editingAddressId}`,
            addressPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Address updated successfully');
        } else {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/auth/addresses`,
            addressPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success('Address added successfully');
        }

        // Refresh addresses
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/addresses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const transformedAddresses = (response.data.addresses || []).map(addr => ({
          id: addr._id,
          type: addr.type || 'home',
          address: addr.street || '',
          apartment: addr.apartment || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.zip || '',
          isDefault: addr.isPrimary || false
        }));
        setAddresses(transformedAddresses);

        setShowAddAddress(false);
        setEditingAddressId(null);
        resetAddressForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    }
  };

  const handleEditAddress = (id) => {
    const address = addresses.find(addr => addr.id === id);
    if (address) {
      setAddressData(address);
      setEditingAddressId(id);
      setShowAddAddress(true);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/auth/addresses/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success('Address deleted successfully');
      } catch (error) {
        toast.error('Deletion failed');
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/addresses/${id}/primary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${process.env.REACT_APP_API_URL}/orders/${orderId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Cancellation failed');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Deletion failed');
      }
    }
  };

  const handleDownloadInvoice = (order) => {
    if (order.paymentStatus === 'completed') {
      generateInvoice(order);
    } else {
      toast.error('Invoice available only for completed orders');
    }
  };

  const resetAddressForm = () => {
    setAddressData({
      type: 'home',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setErrors({});
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPinned className="w-5 h-5" />;
    }
  };

  const getStatusClass = (order) => {
    if (order.status === 'cancelled') return 'cancelled';
    return order.paymentStatus ? order.paymentStatus.toLowerCase() : 'pending';
  };

  const getStatusText = (order) => {
    if (order.status === 'cancelled') return 'Cancelled';
    return order.paymentStatus ? 
      order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 
      'Pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF9E6] via-[#F3D35C]/10 to-[#FFF9E6] border-b border-[#3B291A]/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#3B291A]/70 hover:text-[#4F8F3C] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-[#3B291A] text-4xl mb-2">My Profile</h1>
            <p className="text-[#3B291A]/60">Manage your account and addresses</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-6 border border-[#F3D35C]/20 shadow-sm mb-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F3D35C] to-[#D4A75B] flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-[#3B291A]" />
                  </div>
                  <h2 className="text-[#3B291A] text-xl font-semibold">{user.fullName}</h2>
                  <p className="text-[#3B291A]/60 text-sm mt-1">{user.email}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] shadow-md'
                        : 'text-[#3B291A]/60 hover:text-[#3B291A] hover:bg-[#FFF9E6]'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'addresses'
                        ? 'bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] shadow-md'
                        : 'text-[#3B291A]/60 hover:text-[#3B291A] hover:bg-[#FFF9E6]'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    Manage Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                      activeTab === 'orders'
                        ? 'bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] shadow-md'
                        : 'text-[#3B291A]/60 hover:text-[#3B291A] hover:bg-[#FFF9E6]'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    Order History
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Profile Tab Content */}
              {activeTab === 'profile' && (
                <div className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3D35C] to-[#D4A75B] flex items-center justify-center">
                        <User className="w-6 h-6 text-[#3B291A]" />
                      </div>
                      <h2 className="text-[#3B291A] text-2xl">Personal Information</h2>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#4F8F3C] text-white rounded-xl hover:bg-[#3d7230] transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[#3B291A] mb-2">
                          First Name
                        </label>
                        <div className="px-4 py-3 rounded-2xl border border-[#3B291A]/10 bg-[#FFF9E6]/30 text-[#3B291A]">
                          {profileData.firstName || 'Not set'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#3B291A] mb-2">
                          Last Name
                        </label>
                        <div className="px-4 py-3 rounded-2xl border border-[#3B291A]/10 bg-[#FFF9E6]/30 text-[#3B291A]">
                          {profileData.lastName || 'Not set'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#3B291A] mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                          <div className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#3B291A]/10 bg-[#FFF9E6]/30 text-[#3B291A]/60">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#3B291A] mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                          <div className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#3B291A]/10 bg-[#FFF9E6]/30 text-[#3B291A]/60">
                            {profileData.phone || 'Not set'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab Content */}
              {activeTab === 'addresses' && (
                <div className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F8F3C] to-[#8CCB5E] flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-[#3B291A] text-2xl">Saved Addresses</h2>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddAddress(true);
                        resetAddressForm();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#4F8F3C] text-white rounded-xl hover:bg-[#3d7230] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F8F3C] mx-auto"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-[#3B291A]/20 mx-auto mb-4" />
                      <p className="text-[#3B291A]/60">No saved addresses</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="bg-white rounded-2xl p-6 border border-[#3B291A]/10 hover:border-[#F3D35C] transition-all relative"
                        >
                          {address.isDefault && (
                            <span className="absolute top-4 right-4 bg-[#8CCB5E] text-white text-xs px-3 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] flex items-center justify-center text-[#4F8F3C]">
                              {getAddressIcon(address.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-[#3B291A] mb-1 uppercase tracking-wide">
                                {address.name}
                              </p>
                              <p className="text-[#3B291A]/80 text-sm">
                                {address.address}
                                {address.apartment && `, ${address.apartment}`}
                              </p>
                              <p className="text-[#3B291A]/80 text-sm">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-4 border-t border-[#3B291A]/10">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="text-sm text-[#4F8F3C] hover:underline"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(address.id)}
                              className="ml-auto text-[#4F8F3C] hover:text-[#3d7230] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab Content */}
              {activeTab === 'orders' && (
                <div className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3D35C] to-[#D4A75B] flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#3B291A]" />
                      </div>
                      <h2 className="text-[#3B291A] text-2xl">Order History</h2>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F3D35C] mx-auto"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-[#3B291A]/20 mx-auto mb-4" />
                      <p className="text-[#3B291A]/60">No orders found</p>
                      <Link 
                        to="/products"
                        className="inline-block mt-4 text-[#4F8F3C] hover:text-[#3d7230] transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl border border-[#3B291A]/10 hover:border-[#F3D35C] transition-all overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-[#3B291A] font-medium">
                                  Order #{order._id?.slice(-6).toUpperCase()}
                                </h3>
                                <p className="text-sm text-[#3B291A]/60">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                getStatusClass(order) === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : getStatusClass(order) === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {getStatusText(order)}
                              </span>
                            </div>

                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                {order.items?.slice(0, 3).map((item, index) => (
                                  <img
                                    key={index}
                                    src={item.image || item.productId?.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-[#3B291A]/10"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ))}
                                {order.items?.length > 3 && (
                                  <div className="w-12 h-12 rounded-lg bg-[#FFF9E6] flex items-center justify-center">
                                    <span className="text-[#3B291A]/60 text-sm">
                                      +{order.items.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-[#3B291A]/80">
                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#3B291A]/10">
                              <div className="text-[#3B291A] font-medium">
                                Total: ₹{order.totalAmount}
                              </div>
                              <div className="flex items-center gap-2">
                                {order.paymentStatus === 'completed' && (
                                  <button
                                    onClick={() => handleDownloadInvoice(order)}
                                    className="flex items-center gap-1 text-sm text-[#4F8F3C] hover:text-[#3d7230] transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    Invoice
                                  </button>
                                )}
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </button>
                                )}
                                {order.status === 'cancelled' && (
                                  <button
                                    onClick={() => handleDeleteOrder(order._id)}
                                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                )}
                                {/* <Link 
                                  to={`/order/${order._id}`}
                                  className="text-sm text-[#4F8F3C] hover:text-[#3d7230] transition-colors ml-2"
                                >
                                  View Details →
                                </Link> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#3B291A]">
                  Edit Profile
                </h2>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setErrors({});
                  }}
                  className="text-[#3B291A]/60 hover:text-[#3B291A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileInputChange}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.firstName ? 'border-red-500' : 'border-[#3B291A]/10'
                      } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileInputChange}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.lastName ? 'border-red-500' : 'border-[#3B291A]/10'
                      } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#3B291A] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#3B291A]/10 bg-[#FFF9E6]/30 text-[#3B291A]/60"
                        placeholder="Email"
                      />
                    </div>
                    <p className="text-xs text-[#3B291A]/50 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileInputChange}
                        // maxLength={10}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                          errors.phone ? 'border-red-500' : 'border-[#3B291A]/10'
                        } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                        placeholder="Phone Number"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#3B291A]/10">
                  <h3 className="text-[#3B291A] text-lg mb-4">Change Password</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#3B291A] mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleProfileInputChange}
                        className={`w-full px-4 py-3 rounded-2xl border ${
                          errors.password ? 'border-red-500' : 'border-[#3B291A]/10'
                        } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                        placeholder="Leave blank to keep current"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#3B291A] mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileInputChange}
                        className={`w-full px-4 py-3 rounded-2xl border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-[#3B291A]/10'
                        } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                        placeholder="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Address Modal */}
        {showAddAddress && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#3B291A]">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddAddress(false);
                    setEditingAddressId(null);
                    resetAddressForm();
                  }}
                  className="text-[#3B291A]/60 hover:text-[#3B291A] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#3B291A] mb-2">
                    Address Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={addressData.type}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#3B291A]/10 focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3B291A] mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressInputChange}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      errors.address ? 'border-red-500' : 'border-[#3B291A]/10'
                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#3B291A] mb-2">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={addressData.apartment}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#3B291A]/10 focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all"
                    placeholder="Apartment, floor, etc."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.city ? 'border-red-500' : 'border-[#3B291A]/10'
                      } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressInputChange}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.state ? 'border-red-500' : 'border-[#3B291A]/10'
                      } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all bg-white`}
                    >
                      <option value="">Select State</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-[#3B291A] mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressInputChange}
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-2xl border ${
                        errors.pincode ? 'border-red-500' : 'border-[#3B291A]/10'
                      } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                      placeholder="6-digit"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#FFF9E6] rounded-2xl">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressData.isDefault}
                    onChange={handleAddressInputChange}
                    className="w-5 h-5 text-[#4F8F3C] rounded focus:ring-[#F3D35C]"
                  />
                  <label htmlFor="isDefault" className="text-[#3B291A] cursor-pointer">
                    Set as default address
                  </label>
                </div>

                <button
                  onClick={handleSaveAddress}
                  className="w-full bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}