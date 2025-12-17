// import React, { useEffect, useState } from 'react';
// import { useCart } from '../../context/CartContext';
// import { loadScript } from '../../utils/loadScript';
// import Header from '../../components/header';
// import './checkout.css';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Footer from '../../components/Footer/Footer';

// const Checkout = () => {
//     const { cart, clearCart, fetchCart, resetCart } = useCart();
//     const location = useLocation();
//     const { productId, quantity, totalAmount, name } = location.state || {};
//     const { user } = useAuth();
//     const [loading, setLoading] = useState(false);
//     const [savedAddresses, setSavedAddresses] = useState([]);
//     const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
//         mode: 'onChange'
//     });
//     const navigate = useNavigate();


//     useEffect(() => {
//         if (location.state?.isDirectPurchase) {
//             // Ensure cart is properly loaded
//             fetchCart();
//         }
//     }, [location.state, fetchCart]);

//     useEffect(() => {
//         fetchCart(); // Refresh cart when component mounts
//     }, [fetchCart]);

//     useEffect(() => {
//         if (cart.coupon) fetchCart(); // Refresh after coupon changes
//     }, [cart.coupon, fetchCart]);

//     // Fetch saved addresses
//     useEffect(() => {
//         const fetchAddresses = async () => {
//             if (user) {
//                 try {
//                     const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/addresses`, {
//                         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                     });
//                     setSavedAddresses(data.addresses);

//                     // Auto-fill primary address
//                     const primaryAddress = data.addresses.find(addr => addr.isPrimary);
//                     if (primaryAddress) {
//                         Object.entries(primaryAddress).forEach(([key, value]) => {
//                             setValue(key, value);
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error fetching addresses:', error);
//                 }
//             }
//         };
//         fetchAddresses();
//     }, [user, setValue]);

//     // Google Maps autocomplete initialization
//     useEffect(() => {
//         const initAutocomplete = () => {
//             const addressInput = document.getElementById('address');
//             const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
//                 types: ['geocode'],
//                 componentRestrictions: { country: 'in' },
//                 fields: ['address_components', 'formatted_address']
//             });

//             autocomplete.addListener('place_changed', () => {
//                 const place = autocomplete.getPlace();
//                 if (!place.address_components) return;

//                 const componentForm = {
//                     postal_code: 'short_name',
//                     locality: 'long_name',
//                     administrative_area_level_1: 'long_name'
//                 };

//                 const addressData = {
//                     address: place.formatted_address,
//                     city: '',
//                     state: '',
//                     zip: ''
//                 };

//                 place.address_components.forEach(component => {
//                     const componentType = component.types[0];
//                     if (componentForm[componentType]) {
//                         switch (componentType) {
//                             case 'postal_code':
//                                 addressData.zip = component[componentForm[componentType]];
//                                 break;
//                             case 'locality':
//                                 addressData.city = component[componentForm[componentType]];
//                                 break;
//                             case 'administrative_area_level_1':
//                                 addressData.state = component[componentForm[componentType]];
//                                 break;
//                             default:
//                                 break;
//                         }
//                     }
//                 });

//                 setValue('address', addressData.address);
//                 setValue('city', addressData.city);
//                 setValue('state', addressData.state);
//                 setValue('zip', addressData.zip);
//                 trigger('zip');
//             });
//         };

//         if (window.google) {
//             initAutocomplete();
//         } else {
//             loadScript(
//                 `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`
//             ).then(() => initAutocomplete());
//         }
//     }, [setValue, trigger]);

//     const handlePayment = async (formData) => {
//         try {
//             setLoading(true);
//             await fetchCart();

//             if (cart.coupon && !formData.couponCode) {
//                 await resetCart();
//             }

//             // Calculate totals with coupon discount
//             // const subtotal = cart.items.reduce((sum, item) =>
//             //     sum + (item.discountPrice || item.price) * item.quantity, 0);
//             // const discount = cart.coupon?.discount || 0;
//             // const totalAmount = subtotal - discount;
//             const totalAmount = cart.items.reduce((sum, item) =>
//                 sum + (item.discountPrice || item.price) * item.quantity, 0
//             ) - (cart.coupon?.discount || 0);

//             // Save address if requested
//             if (formData.saveAddress && user) {
//                 const data = await axios.put(`${process.env.REACT_APP_API_URL}/auth/addresses`, formData, {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                 });
//                 setSavedAddresses(data.addresses);
//             }

//             const paymentAmount = cart.totalAfterDiscount ||
//                 cart.items.reduce((sum, item) =>
//                     sum + (item.price * item.quantity), 0
//                 );

//             // Create payment order with discounted amount
//             const response = await axios.post(
//                 `${process.env.REACT_APP_API_URL}/cart/payment/create-order`,
//                 {
//                     amount: paymentAmount,
//                     shippingAddress: formData
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                 }
//             );

//             // Initialize Razorpay payment
//             await loadScript('https://checkout.razorpay.com/v1/checkout.js');
//             const paymentOptions = {
//                 key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//                 amount: (totalAmount * 100).toString(), // Convert to paise
//                 currency: "INR",
//                 name: "FarFoo",
//                 description: "Order Transaction",
//                 order_id: response.data.id,
//                 handler: async (paymentResponse) => {
//                     try {
//                         if (!paymentResponse.razorpay_payment_id) {
//                             throw new Error('Payment verification failed');
//                         }
//                         const { data: order } = await axios.post(
//                             `${process.env.REACT_APP_API_URL}/orders`,
//                             {
//                                 razorpayPaymentId: paymentResponse.razorpay_payment_id,
//                                 razorpayOrderId: paymentResponse.razorpay_order_id,
//                                 razorpaySignature: paymentResponse.razorpay_signature,
//                                 shippingAddress: {
//                                     name: formData.name,
//                                     phone: formData.phone,
//                                     address: formData.address,
//                                     city: formData.city,
//                                     state: formData.state,
//                                     zip: formData.zip,
//                                     email: formData.email
//                                 },
//                                 items: location.state?.isDirectPurchase
//                                     ? [{
//                                         product: productId, // Send as 'product' instead of 'productId'
//                                         name: name,
//                                         quantity: quantity,
//                                         price: totalAmount / quantity
//                                     }]
//                                     : cart.items.map(item => ({
//                                         product: item.product, // Ensure this matches your product ID field
//                                         name: item.name,
//                                         quantity: item.quantity,
//                                         price: item.discountPrice || item.price
//                                     })),
//                                 totalAmount: totalAmount, // Use discounted amount
//                                 coupon: cart.coupon // Include coupon details
//                             },
//                             {
//                                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                             }
//                         );
//                         await clearCart();
//                         await fetchCart();
//                         navigate('/order-success', { state: { order } });
//                     } catch (error) {
//                         console.error('Order completion failed:', {
//                             error,
//                             paymentResponse,
//                             cart: cart.items
//                         });
//                         alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
//                         await fetchCart(); // Refresh cart state
//                     }
//                 },
//                 prefill: {
//                     name: formData.name,
//                     email: formData.email,
//                     contact: formData.phone
//                 },
//                 theme: { color: "#3399cc" }
//             };

//             new window.Razorpay(paymentOptions).open();
//         } catch (error) {
//             alert(error.response?.data?.message || 'Payment failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="checkout-container">
//                 <div className="checkout-header">
//                     <Link to="/cart" className="back-button">
//                         &larr; Back to Cart
//                     </Link>
//                     {user && (
//                         <Link to="/account/addresses" className="manage-address-link">
//                             Manage Saved Addresses
//                         </Link>
//                     )}
//                     <h1>Checkout</h1>
//                 </div>

//                 <form onSubmit={handleSubmit(handlePayment)} className="checkout-grid">
//                     <div className="checkout-form">
//                         <section className="form-section">
//                             <h2 className="section-title">Shipping Information</h2>

//                             {/* Address Selection */}
//                             {savedAddresses?.length > 0 && (
//                                 <div className="form-group">
//                                     <label>Select Saved Address</label>
//                                     <select
//                                         onChange={(e) => {
//                                             const address = savedAddresses.find(a => a._id === e.target.value);
//                                             if (address) {
//                                                 // Set all form fields including name, email, and phone
//                                                 setValue('name', address.name);
//                                                 setValue('email', address.email);
//                                                 setValue('phone', address.phone);
//                                                 setValue('address', address.address);
//                                                 setValue('city', address.city);
//                                                 setValue('state', address.state);
//                                                 setValue('zip', address.zip);
//                                                 trigger(); // Trigger form validation
//                                             }
//                                         }}
//                                     >
//                                         <option value="">Select Saved Address</option>
//                                         {savedAddresses.map(address => (
//                                             <option
//                                                 key={address._id}
//                                                 value={address._id}
//                                             >
//                                                 {address.name} - {(address.address || '').substring(0, 30)}...
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}

//                             {/* Shipping Form */}
//                             <div className="form-group">
//                                 <label>Full Name</label>
//                                 <input
//                                     {...register("name", { required: "Name is required" })}
//                                     className="modern-input"
//                                 />
//                                 {errors.name && <span className="error-message">{errors.name.message}</span>}
//                             </div>

//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label>Email</label>
//                                     <input
//                                         {...register("email", {
//                                             required: "Email is required",
//                                             pattern: {
//                                                 value: /^\S+@\S+$/i,
//                                                 message: "Invalid email address"
//                                             }
//                                         })}
//                                         className="modern-input"
//                                         type="email"
//                                     />
//                                     {errors.email && <span className="error-message">{errors.email.message}</span>}
//                                 </div>

//                                 <div className="form-group">
//                                     <label>Phone</label>
//                                     <input
//                                         {...register("phone", {
//                                             required: "Phone is required",
//                                             pattern: {
//                                                 value: /^[0-9]{10}$/,
//                                                 message: "Invalid phone number"
//                                             }
//                                         })}
//                                         className="modern-input"
//                                         type="tel"
//                                     />
//                                     {errors.phone && <span className="error-message">{errors.phone.message}</span>}
//                                 </div>
//                             </div>

//                             <div className="form-group">
//                                 <label>Address</label>
//                                 <input
//                                     id="address"
//                                     {...register("address", { required: "Address is required" })}
//                                     className="modern-input"
//                                     placeholder="Start typing your address..."
//                                 />
//                                 {errors.address && <span className="error-message">{errors.address.message}</span>}
//                             </div>

//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label>City</label>
//                                     <input
//                                         {...register("city", { required: "City is required" })}
//                                         className="modern-input"
//                                     />
//                                     {errors.city && <span className="error-message">{errors.city.message}</span>}
//                                 </div>

//                                 <div className="form-group">
//                                     <label>State</label>
//                                     <input
//                                         {...register("state", { required: "State is required" })}
//                                         className="modern-input"
//                                     />
//                                     {errors.state && <span className="error-message">{errors.state.message}</span>}
//                                 </div>

//                                 <div className="form-group">
//                                     <label>ZIP Code</label>
//                                     <input
//                                         {...register("zip", {
//                                             required: "ZIP Code is required",
//                                             pattern: {
//                                                 value: /^\d{6}$/,
//                                                 message: "Invalid Indian PIN code (6 digits required)"
//                                             },
//                                             validate: value => {
//                                                 if (!value && document.getElementById('address').value) {
//                                                     return "Please enter PIN code manually";
//                                                 }
//                                                 return true;
//                                             }
//                                         })}
//                                         className="modern-input"
//                                     // placeholder="Enter 6-digit PIN code"
//                                     />
//                                     {errors.zip && <span className="error-message">{errors.zip.message}</span>}
//                                     <p className="input-hint">If not auto-filled, please enter manually</p>
//                                 </div>
//                             </div>
//                             {/* Save Address Checkbox */}
//                             {user && (
//                                 <div className="form-group">
//                                     <label className="save-address">
//                                         <input
//                                             type="checkbox"
//                                             {...register("saveAddress")}
//                                             className="checkbox-input"
//                                         />
//                                         Save this address for future orders
//                                     </label>
//                                 </div>
//                             )}
//                         </section>
//                     </div>



//                     <div className="order-summary">
//                         <h2 className="section-title">Order Summary</h2>
//                         <div className="order-items">
//                             {cart.items.map(item => (
//                                 <div key={item._id} className="order-item">
//                                     <img src={item.images[0]?.url} alt={item.name} />
//                                     <div className="item-details">
//                                         <h3>{item.name}</h3>
//                                         <p>Qty: {item.quantity}</p>
//                                         <p>₹{(item.discountPrice || item.price).toFixed(2)}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="total-section">
//                             <div className="total-row">
//                                 <span>Subtotal</span>
//                                 <span>
//                                     ₹{cart.items.reduce((sum, item) =>
//                                         sum + item.price * item.quantity, 0
//                                     ).toFixed(2)}
//                                 </span>
//                             </div>

//                             {cart.coupon && (
//                                 <div className="total-row discount-row">
//                                     <span>Discount ({cart.coupon.code})</span>
//                                     <span>-₹{cart.coupon.discount.toFixed(2)}</span>
//                                 </div>
//                             )}

//                             <div className="total-row">
//                                 <span>Shipping</span>
//                                 <span>Free</span>
//                             </div>

//                             <div className="total-row grand-total">
//                                 <span>Total</span>
//                                 <span>
//                                     ₹{(
//                                         cart.items.reduce((sum, item) =>
//                                             sum + (item.discountPrice || item.price) * item.quantity, 0
//                                         ) - (cart.coupon?.discount || 0)
//                                     ).toFixed(2)}
//                                 </span>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading || cart.items.length === 0}
//                             className="payment-button"
//                         >
//                             {loading ? <div className="spinner"></div> : 'Proceed to Pay'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default Checkout;




















import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { loadScript } from '../../utils/loadScript';
import Header from '../../components/header';
import './checkout.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';
import { ArrowLeft, Package, Truck, ShieldCheck, CreditCard, MapPin, User, Mail, Phone, Home, CheckCircle2, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cart, clearCart, fetchCart, resetCart, isAuthenticated } = useCart();
    const location = useLocation();
    const { productId, quantity, totalAmount, name, isDirectPurchase } = location.state || {};
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [loginError, setLoginError] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = useForm({
        mode: 'onChange'
    });
    const navigate = useNavigate();

    // Helper function to safely get image URL
    const getItemImage = (item) => {
        if (item?.images?.[0]?.url) {
            return item.images[0].url;
        } else if (item?.product?.images?.[0]?.url) {
            return item.product.images[0].url;
        } else if (item?.image) {
            return item.image;
        }
        return '';
    };

    // Helper function to safely get item name
    const getItemName = (item) => {
        return item?.product?.name || item?.name || 'Product';
    };

    // Helper function to safely get item price
    const getItemPrice = (item) => {
        const price = item?.product?.price || item?.price || 0;
        return parseFloat(price);
    };

    // Helper function to get item discount price
    const getItemDiscountPrice = (item) => {
        const discountPrice = item?.product?.discountPrice || item?.discountPrice;
        const price = getItemPrice(item);
        return discountPrice || price;
    };

    // Helper function to get item weight
    const getItemWeight = (item) => {
        return item?.product?.weight || item?.weight || '500g';
    };

    // Redirect if cart is empty and not a direct purchase
    useEffect(() => {
        if (!isDirectPurchase && cart.items.length === 0) {
            navigate('/cart');
        }
    }, [isDirectPurchase, cart.items.length, navigate]);

    useEffect(() => {
        if (isDirectPurchase) {
            fetchCart();
        }
    }, [isDirectPurchase, fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (cart.coupon) fetchCart();
    }, [cart.coupon, fetchCart]);

    // Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user && isAuthenticated) {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/addresses`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setSavedAddresses(data.addresses || []);

                    // Auto-fill primary address
                    const primaryAddress = (data.addresses || []).find(addr => addr.isPrimary);
                    if (primaryAddress) {
                        Object.entries(primaryAddress).forEach(([key, value]) => {
                            if (value) setValue(key, value);
                        });
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            }
        };
        fetchAddresses();
    }, [user, isAuthenticated, setValue]);

    // Google Maps autocomplete initialization
    useEffect(() => {
        const initAutocomplete = () => {
            const addressInput = document.getElementById('address');
            if (!addressInput) return;

            const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
                types: ['geocode'],
                componentRestrictions: { country: 'in' },
                fields: ['address_components', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.address_components) return;

                const addressData = {
                    address: place.formatted_address,
                    city: '',
                    state: '',
                    zip: ''
                };

                place.address_components.forEach(component => {
                    const componentType = component.types[0];
                    if (componentType === 'postal_code') {
                        addressData.zip = component.short_name;
                    } else if (componentType === 'locality') {
                        addressData.city = component.long_name;
                    } else if (componentType === 'administrative_area_level_1') {
                        addressData.state = component.long_name;
                    }
                });

                setValue('address', addressData.address);
                setValue('city', addressData.city);
                setValue('state', addressData.state);
                setValue('zip', addressData.zip);
                trigger('zip');
            });
        };

        if (window.google) {
            initAutocomplete();
        } else if (process.env.REACT_APP_GOOGLE_MAPS_KEY) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`
            ).then(() => initAutocomplete());
        }
    }, [setValue, trigger]);

    // Calculate totals
    const calculateSubtotal = () => {
        if (isDirectPurchase) {
            return totalAmount || 0;
        }
        return cart.items.reduce((sum, item) => {
            const price = getItemPrice(item);
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    };

    const calculateDiscountedSubtotal = () => {
        if (isDirectPurchase) {
            return totalAmount || 0;
        }
        return cart.items.reduce((sum, item) => {
            const price = getItemDiscountPrice(item);
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const discountedSubtotal = calculateDiscountedSubtotal();
    const discountAmount = subtotal - discountedSubtotal;
    const couponDiscount = cart.coupon?.discount || 0;
    const deliveryCharge = subtotal >= 499 ? 0 : 40;
    const total = discountedSubtotal - couponDiscount + deliveryCharge;

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (loginError) setLoginError('');
    };

    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            setLoginError('Please enter both email and password');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                email: loginData.email,
                password: loginData.password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                login(response.data.user);
                setShowLoginModal(false);
                setLoginData({ email: '', password: '' });
                setLoginError('');
                window.location.reload(); // Refresh to update auth state
            }
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleForgotPasswordInputChange = (e) => {
        setForgotPasswordEmail(e.target.value);
        if (forgotPasswordMessage) setForgotPasswordMessage('');
    };

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail) {
            setForgotPasswordMessage('Please enter your email');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                email: forgotPasswordEmail
            });
            setForgotPasswordMessage('Password reset link sent to your email.');
        } catch (error) {
            setForgotPasswordMessage(error.response?.data?.message || 'Failed to send reset link');
        }
    };

    const handlePayment = async (formData) => {
        try {
            setLoading(true);
            await fetchCart();

            if (cart.coupon && !formData.couponCode) {
                await resetCart();
            }

            // Prepare order items
            const orderItems = isDirectPurchase
                ? [{
                    product: productId,
                    name: name,
                    quantity: quantity,
                    price: totalAmount / quantity
                }]
                : cart.items.map(item => {
                    const productId = item.product?._id || item.productId || item.product;
                    return {
                        product: productId,
                        name: getItemName(item),
                        quantity: item.quantity || 1,
                        price: getItemDiscountPrice(item)
                    };
                });

            // Save address if requested and user is authenticated
            if (formData.saveAddress && isAuthenticated && user) {
                await axios.put(`${process.env.REACT_APP_API_URL}/auth/addresses`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }

            // Handle Cash on Delivery
            if (paymentMethod === 'cod') {
                if (!isAuthenticated) {
                    alert('Please login to use Cash on Delivery');
                    setLoading(false);
                    return;
                }

                try {
                    const { data: order } = await axios.post(
                        `${process.env.REACT_APP_API_URL}/orders`,
                        {
                            shippingAddress: {
                                name: formData.name,
                                phone: formData.phone,
                                address: formData.address,
                                city: formData.city,
                                state: formData.state,
                                zip: formData.zip,
                                email: formData.email
                            },
                            items: orderItems,
                            totalAmount: total,
                            coupon: cart.coupon,
                            paymentMethod: 'cod',
                            paymentStatus: 'pending'
                        },
                        {
                            headers: { 
                                Authorization: `Bearer ${localStorage.getItem('token')}` 
                            }
                        }
                    );
                    
                    await clearCart();
                    await fetchCart();
                    navigate('/order-success', { state: { order } });
                } catch (error) {
                    alert(`Order failed: ${error.response?.data?.message || error.message}`);
                } finally {
                    setLoading(false);
                }
                return;
            }

            // Handle Razorpay payment
            const paymentAmount = cart.totalAfterDiscount || subtotal;

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/cart/payment/create-order`,
                {
                    amount: paymentAmount,
                    shippingAddress: formData
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            const paymentOptions = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: (total * 100).toString(),
                currency: "INR",
                name: "FarFoo",
                description: "Order Transaction",
                order_id: response.data.id,
                handler: async (paymentResponse) => {
                    try {
                        if (!paymentResponse.razorpay_payment_id) {
                            throw new Error('Payment verification failed');
                        }

                        const { data: order } = await axios.post(
                            `${process.env.REACT_APP_API_URL}/orders`,
                            {
                                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                                razorpayOrderId: paymentResponse.razorpay_order_id,
                                razorpaySignature: paymentResponse.razorpay_signature,
                                shippingAddress: {
                                    name: formData.name,
                                    phone: formData.phone,
                                    address: formData.address,
                                    city: formData.city,
                                    state: formData.state,
                                    zip: formData.zip,
                                    email: formData.email
                                },
                                items: orderItems,
                                totalAmount: total,
                                coupon: cart.coupon,
                                paymentMethod: 'razorpay',
                                paymentStatus: 'completed'
                            },
                            {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            }
                        );
                        
                        await clearCart();
                        await fetchCart();
                        navigate('/order-success', { state: { order } });
                    } catch (error) {
                        console.error('Order completion failed:', error);
                        alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
                        await fetchCart();
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#3399cc" }
            };

            new window.Razorpay(paymentOptions).open();
        } catch (error) {
            alert(error.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValue(name, value);
        if (errors[name]) {
            trigger(name);
        }
    };

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FFF9E6] via-[#F3D35C]/10 to-[#FFF9E6] border-b border-[#3B291A]/10">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <Link 
                            to="/cart" 
                            className="inline-flex items-center gap-2 text-[#3B291A]/70 hover:text-[#4F8F3C] transition-colors mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Cart
                        </Link>
                        <h1 className="text-[#3B291A] text-4xl mb-2">Checkout</h1>
                        <p className="text-[#3B291A]/60">Complete your order securely</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <form onSubmit={handleSubmit(handlePayment)}>
                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Left Column - Forms */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Already Registered Banner */}
                                {!isAuthenticated && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-gradient-to-r from-[#4F8F3C] to-[#8CCB5E] rounded-3xl p-6 text-white shadow-lg"
                                    >
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-xl mb-2 flex items-center gap-2">
                                                    <User className="w-5 h-5" />
                                                    Already Registered?
                                                </h3>
                                                <p className="text-white/90 text-sm">
                                                    Login to access saved addresses, enable Cash on Delivery, and enjoy faster checkout!
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginModal(true)}
                                                className="bg-white text-[#4F8F3C] px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <LogIn className="w-5 h-5" />
                                                Login Now
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Logged In Success Banner */}
                                {isAuthenticated && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-gradient-to-r from-[#8CCB5E] to-[#4F8F3C] rounded-3xl p-6 text-white shadow-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl mb-1">Welcome Back!</h3>
                                                <p className="text-white/90 text-sm">
                                                    You're logged in. COD is now available for your order.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Contact Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F3D35C] to-[#D4A75B] flex items-center justify-center">
                                            <User className="w-6 h-6 text-[#3B291A]" />
                                        </div>
                                        <h2 className="text-[#3B291A] text-2xl">Contact Information</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-[#3B291A] mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                {...register("name", { required: "Name is required" })}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-2xl border ${
                                                    errors.name ? 'border-red-500' : 'border-[#3B291A]/10'
                                                } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-[#3B291A] mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^\S+@\S+$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                                                        errors.email ? 'border-red-500' : 'border-[#3B291A]/10'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-[#3B291A] mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    {...register("phone", {
                                                        required: "Phone number is required",
                                                        pattern: {
                                                            value: /^[0-9]{10}$/,
                                                            message: "Invalid 10-digit phone number"
                                                        }
                                                    })}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                                                        errors.phone ? 'border-red-500' : 'border-[#3B291A]/10'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                    placeholder="10-digit mobile number"
                                                    maxLength={10}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Shipping Address */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F8F3C] to-[#8CCB5E] flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="text-[#3B291A] text-2xl">Shipping Address</h2>
                                    </div>

                                    {/* Saved Addresses Selection */}
                                    {isAuthenticated && savedAddresses?.length > 0 && (
                                        <div className="mb-6">
                                            <label className="block text-[#3B291A] mb-2">
                                                Select Saved Address
                                            </label>
                                            <select
                                                onChange={(e) => {
                                                    const address = savedAddresses.find(a => a._id === e.target.value);
                                                    if (address) {
                                                        Object.keys(address).forEach(key => {
                                                            if (address[key]) setValue(key, address[key]);
                                                        });
                                                        trigger();
                                                    }
                                                }}
                                                className="w-full px-4 py-3 rounded-2xl border border-[#3B291A]/10 focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all"
                                            >
                                                <option value="">Select Saved Address</option>
                                                {savedAddresses.map(address => (
                                                    <option key={address._id} value={address._id}>
                                                        {address.name} - {address.address?.substring(0, 30)}...
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="address" className="block text-[#3B291A] mb-2">
                                                Street Address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Home className="absolute left-4 top-4 w-5 h-5 text-[#3B291A]/40" />
                                                <input
                                                    type="text"
                                                    id="address"
                                                    {...register("address", { required: "Address is required" })}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                                                        errors.address ? 'border-red-500' : 'border-[#3B291A]/10'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                    placeholder="Enter your address"
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="apartment" className="block text-[#3B291A] mb-2">
                                                Apartment, Suite, etc. (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="apartment"
                                                {...register("apartment")}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-2xl border border-[#3B291A]/10 focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all"
                                                placeholder="Apartment, floor, etc."
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <label htmlFor="city" className="block text-[#3B291A] mb-2">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    {...register("city", { required: "City is required" })}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-2xl border ${
                                                        errors.city ? 'border-red-500' : 'border-[#3B291A]/10'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                    placeholder="City"
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="state" className="block text-[#3B291A] mb-2">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="state"
                                                    {...register("state", { required: "State is required" })}
                                                    onChange={handleInputChange}
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
                                                {errors.state && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="zip" className="block text-[#3B291A] mb-2">
                                                    Pincode <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="zip"
                                                    {...register("zip", {
                                                        required: "Pincode is required",
                                                        pattern: {
                                                            value: /^\d{6}$/,
                                                            message: "Invalid 6-digit pincode"
                                                        }
                                                    })}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-2xl border ${
                                                        errors.zip ? 'border-red-500' : 'border-[#3B291A]/10'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                                    placeholder="6-digit pincode"
                                                    maxLength={6}
                                                />
                                                {errors.zip && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Save Address Checkbox */}
                                        {isAuthenticated && (
                                            <div className="pt-4">
                                                <label className="flex items-center gap-2 text-[#3B291A]">
                                                    <input
                                                        type="checkbox"
                                                        {...register("saveAddress")}
                                                        className="w-4 h-4 rounded border-[#3B291A]/20 focus:ring-[#4F8F3C]"
                                                    />
                                                    Save this address for future orders
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Payment Method */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="bg-gradient-to-br from-[#FFF9E6] to-white rounded-3xl p-8 border border-[#F3D35C]/20 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4A75B] to-[#F3D35C] flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-[#3B291A]" />
                                        </div>
                                        <h2 className="text-[#3B291A] text-2xl">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Razorpay Option */}
                                        <label className={`flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                            paymentMethod === 'razorpay'
                                                ? 'border-[#F3D35C] bg-[#FFF9E6]'
                                                : 'border-[#3B291A]/10 bg-white hover:border-[#F3D35C]/50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={paymentMethod === 'razorpay'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <ShieldCheck className="w-5 h-5 text-[#4F8F3C]" />
                                                    <span className="text-[#3B291A]">Pay Online via Razorpay</span>
                                                </div>
                                                <p className="text-sm text-[#3B291A]/60">
                                                    Credit/Debit Cards, UPI, Net Banking, Wallets - Secured by Razorpay
                                                </p>
                                            </div>
                                        </label>

                                        {/* COD Option - Only for logged-in users */}
                                        {isAuthenticated ? (
                                            <label className={`flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                                paymentMethod === 'cod'
                                                    ? 'border-[#F3D35C] bg-[#FFF9E6]'
                                                    : 'border-[#3B291A]/10 bg-white hover:border-[#F3D35C]/50'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Package className="w-5 h-5 text-[#D4A75B]" />
                                                        <span className="text-[#3B291A]">Cash on Delivery</span>
                                                    </div>
                                                    <p className="text-sm text-[#3B291A]/60">
                                                        Pay when you receive your order
                                                    </p>
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="p-6 rounded-2xl border-2 border-[#3B291A]/10 bg-[#F3D35C]/5">
                                                <div className="flex items-start gap-4">
                                                    <Package className="w-5 h-5 text-[#3B291A]/40 mt-1" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[#3B291A]/60">Cash on Delivery</span>
                                                            <span className="text-xs bg-[#D4A75B]/20 text-[#3B291A]/70 px-3 py-1 rounded-full">
                                                                Registered Customers Only
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-[#3B291A]/50 mb-3">
                                                            COD is available only for registered customers. Please login to use this option.
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowLoginModal(true)}
                                                            className="inline-flex items-center gap-2 text-sm bg-[#4F8F3C] text-white px-4 py-2 rounded-xl hover:bg-[#3d7230] transition-colors"
                                                        >
                                                            <LogIn className="w-4 h-4" />
                                                            Login to Enable COD
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="bg-gradient-to-br from-[#3B291A] to-[#3B291A]/90 rounded-3xl p-8 text-white sticky top-8"
                                >
                                    <h2 className="text-2xl mb-6 flex items-center gap-3">
                                        <Package className="w-6 h-6 text-[#F3D35C]" />
                                        Order Summary
                                    </h2>

                                    {/* Cart Items */}
                                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                                        {isDirectPurchase ? (
                                            <div className="flex gap-4 pb-4 border-b border-white/10">
                                                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                                                    <Package className="w-8 h-8 text-[#F3D35C]" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm mb-1">{name || 'Product'}</h3>
                                                    <p className="text-xs text-white/60">Direct Purchase</p>
                                                    <p className="text-sm text-[#F3D35C] mt-1">Qty: {quantity || 1}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#F3D35C]">₹{totalAmount?.toFixed(2) || '0.00'}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            cart.items.map((item) => {
                                                const imageUrl = getItemImage(item);
                                                const itemName = getItemName(item);
                                                const itemPrice = getItemDiscountPrice(item);
                                                const itemQuantity = item.quantity || 1;
                                                const weight = getItemWeight(item);

                                                return (
                                                    <div key={item._id || item.id} className="flex gap-4 pb-4 border-b border-white/10">
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={itemName}
                                                                className="w-16 h-16 rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
                                                                <Package className="w-8 h-8 text-[#F3D35C]" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <h3 className="text-sm mb-1">{itemName}</h3>
                                                            <p className="text-xs text-white/60">{weight}</p>
                                                            <p className="text-sm text-[#F3D35C] mt-1">Qty: {itemQuantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[#F3D35C]">₹{(itemPrice * itemQuantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                                        <div className="flex justify-between text-white/80">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-white/80">
                                                <span>Product Discount</span>
                                                <span className="text-[#8CCB5E]">-₹{discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        {couponDiscount > 0 && (
                                            <div className="flex justify-between text-white/80">
                                                <span>Coupon Discount</span>
                                                <span className="text-[#8CCB5E]">-₹{couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between text-white/80">
                                            <span>Delivery Charge</span>
                                            <span className={deliveryCharge === 0 ? 'text-[#8CCB5E]' : ''}>
                                                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                                            </span>
                                        </div>
                                        {subtotal < 499 && (
                                            <p className="text-xs text-[#F3D35C]">
                                                Add ₹{(499 - subtotal).toFixed(2)} more for free delivery!
                                            </p>
                                        )}
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between text-xl mb-6">
                                        <span>Total</span>
                                        <span className="text-[#F3D35C]">₹{total.toFixed(2)}</span>
                                    </div>

                                    {/* Place Order Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || (!isDirectPurchase && cart.items.length === 0)}
                                        className="w-full bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-[#3B291A] border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                {paymentMethod === 'cod' ? 'Place COD Order' : 'Place Order'}
                                            </>
                                        )}
                                    </button>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-white/80">
                                            <ShieldCheck className="w-5 h-5 text-[#8CCB5E]" />
                                            <span>Secure Payment via Razorpay</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/80">
                                            <Truck className="w-5 h-5 text-[#8CCB5E]" />
                                            <span>Delivered by Delhivery</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/80">
                                            <Package className="w-5 h-5 text-[#8CCB5E]" />
                                            <span>7-Day Return Policy*</span>
                                        </div>
                                    </div>

                                    {/* Return Policy Note */}
                                    <div className="mt-4 p-4 bg-white/5 rounded-2xl">
                                        <p className="text-xs text-white/60">
                                            *Returns accepted only for unopened packages with intact seals as per FSSAI guidelines for food products.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl text-[#3B291A]">Login to Continue</h2>
                                    <p className="text-sm text-[#3B291A]/60 mt-1">Access COD for registered customers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowLoginModal(false)}
                                    className="text-[#3B291A]/60 hover:text-[#3B291A] transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="loginEmail" className="block text-[#3B291A] mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                                        <input
                                            type="email"
                                            id="loginEmail"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                                                loginError ? 'border-red-500' : 'border-[#3B291A]/10'
                                            } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="loginPassword" className="block text-[#3B291A] mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="loginPassword"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginInputChange}
                                        className={`w-full px-4 py-3 rounded-2xl border ${
                                            loginError ? 'border-red-500' : 'border-[#3B291A]/10'
                                        } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                        placeholder="Enter password"
                                    />
                                </div>

                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-600">{loginError}</p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="w-full bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login & Enable COD
                                </button>

                                <div className="text-sm text-[#3B291A]/60 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowLoginModal(false);
                                            setShowForgotPassword(true);
                                        }}
                                        className="text-[#4F8F3C] hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl text-[#3B291A]">Forgot Password</h2>
                                    <p className="text-sm text-[#3B291A]/60 mt-1">Enter your email to reset password</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="text-[#3B291A]/60 hover:text-[#3B291A] transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="forgotPasswordEmail" className="block text-[#3B291A] mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B291A]/40" />
                                        <input
                                            type="email"
                                            id="forgotPasswordEmail"
                                            name="email"
                                            value={forgotPasswordEmail}
                                            onChange={handleForgotPasswordInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${
                                                forgotPasswordMessage ? 'border-red-500' : 'border-[#3B291A]/10'
                                            } focus:outline-none focus:ring-2 focus:ring-[#F3D35C] transition-all`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                {forgotPasswordMessage && (
                                    <div
                                        className={`rounded-2xl p-3 flex items-start gap-2 ${
                                            forgotPasswordMessage.includes('sent')
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200'
                                        }`}
                                    >
                                        {forgotPasswordMessage.includes('sent') ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <p
                                            className={`text-sm ${
                                                forgotPasswordMessage.includes('sent') ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {forgotPasswordMessage}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="w-full bg-gradient-to-r from-[#F3D35C] to-[#D4A75B] text-[#3B291A] py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Reset Password
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(243, 211, 92, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(243, 211, 92, 0.8);
                }
            `}</style>
            <Footer />
        </>
    );
};

export default Checkout;