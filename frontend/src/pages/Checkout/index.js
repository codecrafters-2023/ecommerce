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

const Checkout = () => {
    const { cart, clearCart, fetchCart, resetCart } = useCart();
    const location = useLocation();
    const { productId, quantity, totalAmount, name } = location.state || {};
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const { register, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
        mode: 'onChange'
    });
    const navigate = useNavigate();


    useEffect(() => {
        if (location.state?.isDirectPurchase) {
            // Ensure cart is properly loaded
            fetchCart();
        }
    }, [location.state, fetchCart]);

    useEffect(() => {
        fetchCart(); // Refresh cart when component mounts
    }, [fetchCart]);

    useEffect(() => {
        if (cart.coupon) fetchCart(); // Refresh after coupon changes
    }, [cart.coupon, fetchCart]);

    // Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user) {
                try {
                    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/addresses`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    setSavedAddresses(data.addresses);

                    // Auto-fill primary address
                    const primaryAddress = data.addresses.find(addr => addr.isPrimary);
                    if (primaryAddress) {
                        Object.entries(primaryAddress).forEach(([key, value]) => {
                            setValue(key, value);
                        });
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            }
        };
        fetchAddresses();
    }, [user, setValue]);

    // Google Maps autocomplete initialization
    useEffect(() => {
        const initAutocomplete = () => {
            const addressInput = document.getElementById('address');
            const autocomplete = new window.google.maps.places.Autocomplete(addressInput, {
                types: ['geocode'],
                componentRestrictions: { country: 'in' },
                fields: ['address_components', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.address_components) return;

                const componentForm = {
                    postal_code: 'short_name',
                    locality: 'long_name',
                    administrative_area_level_1: 'long_name'
                };

                const addressData = {
                    address: place.formatted_address,
                    city: '',
                    state: '',
                    zip: ''
                };

                place.address_components.forEach(component => {
                    const componentType = component.types[0];
                    if (componentForm[componentType]) {
                        switch (componentType) {
                            case 'postal_code':
                                addressData.zip = component[componentForm[componentType]];
                                break;
                            case 'locality':
                                addressData.city = component[componentForm[componentType]];
                                break;
                            case 'administrative_area_level_1':
                                addressData.state = component[componentForm[componentType]];
                                break;
                            default:
                                break;
                        }
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
        } else {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`
            ).then(() => initAutocomplete());
        }
    }, [setValue, trigger]);

    const handlePayment = async (formData) => {
        try {
            setLoading(true);
            await fetchCart();

            if (cart.coupon && !formData.couponCode) {
                await resetCart();
            }

            // Calculate totals with coupon discount
            // const subtotal = cart.items.reduce((sum, item) =>
            //     sum + (item.discountPrice || item.price) * item.quantity, 0);
            // const discount = cart.coupon?.discount || 0;
            // const totalAmount = subtotal - discount;
            const totalAmount = cart.items.reduce((sum, item) =>
                sum + (item.discountPrice || item.price) * item.quantity, 0
            ) - (cart.coupon?.discount || 0);

            // Save address if requested
            if (formData.saveAddress && user) {
                const data = await axios.put(`${process.env.REACT_APP_API_URL}/auth/addresses`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSavedAddresses(data.addresses);
            }

            const paymentAmount = cart.totalAfterDiscount ||
                cart.items.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0
                );

            // Create payment order with discounted amount
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

            // Initialize Razorpay payment
            await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            const paymentOptions = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: (totalAmount * 100).toString(), // Convert to paise
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
                                items: location.state?.isDirectPurchase
                                    ? [{
                                        product: productId, // Send as 'product' instead of 'productId'
                                        name: name,
                                        quantity: quantity,
                                        price: totalAmount / quantity
                                    }]
                                    : cart.items.map(item => ({
                                        product: item.product, // Ensure this matches your product ID field
                                        name: item.name,
                                        quantity: item.quantity,
                                        price: item.discountPrice || item.price
                                    })),
                                totalAmount: totalAmount, // Use discounted amount
                                coupon: cart.coupon // Include coupon details
                            },
                            {
                                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            }
                        );
                        await clearCart();
                        await fetchCart();
                        navigate('/order-success', { state: { order } });
                    } catch (error) {
                        console.error('Order completion failed:', {
                            error,
                            paymentResponse,
                            cart: cart.items
                        });
                        alert(`Order processing failed: ${error.response?.data?.message || error.message}`);
                        await fetchCart(); // Refresh cart state
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

    return (
        <>
            <Header />
            <div className="checkout-container">
                <div className="checkout-header">
                    <Link to="/cart" className="back-button">
                        &larr; Back to Cart
                    </Link>
                    {user && (
                        <Link to="/account/addresses" className="manage-address-link">
                            Manage Saved Addresses
                        </Link>
                    )}
                    <h1>Checkout</h1>
                </div>

                <form onSubmit={handleSubmit(handlePayment)} className="checkout-grid">
                    <div className="checkout-form">
                        <section className="form-section">
                            <h2 className="section-title">Shipping Information</h2>

                            {/* Address Selection */}
                            {savedAddresses?.length > 0 && (
                                <div className="form-group">
                                    <label>Select Saved Address</label>
                                    <select
                                        onChange={(e) => {
                                            const address = savedAddresses.find(a => a._id === e.target.value);
                                            if (address) {
                                                // Set all form fields including name, email, and phone
                                                setValue('name', address.name);
                                                setValue('email', address.email);
                                                setValue('phone', address.phone);
                                                setValue('address', address.address);
                                                setValue('city', address.city);
                                                setValue('state', address.state);
                                                setValue('zip', address.zip);
                                                trigger(); // Trigger form validation
                                            }
                                        }}
                                    >
                                        <option value="">Select Saved Address</option>
                                        {savedAddresses.map(address => (
                                            <option
                                                key={address._id} // Use raw ID only
                                                value={address._id}
                                            >
                                                {address.name} - {address.address.substring(0, 30)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Shipping Form */}
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    className="modern-input"
                                />
                                {errors.name && <span className="error-message">{errors.name.message}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^\S+@\S+$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className="modern-input"
                                        type="email"
                                    />
                                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        {...register("phone", {
                                            required: "Phone is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Invalid phone number"
                                            }
                                        })}
                                        className="modern-input"
                                        type="tel"
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    id="address"
                                    {...register("address", { required: "Address is required" })}
                                    className="modern-input"
                                    placeholder="Start typing your address..."
                                />
                                {errors.address && <span className="error-message">{errors.address.message}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        {...register("city", { required: "City is required" })}
                                        className="modern-input"
                                    />
                                    {errors.city && <span className="error-message">{errors.city.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        {...register("state", { required: "State is required" })}
                                        className="modern-input"
                                    />
                                    {errors.state && <span className="error-message">{errors.state.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label>ZIP Code</label>
                                    <input
                                        {...register("zip", {
                                            required: "ZIP Code is required",
                                            pattern: {
                                                value: /^\d{6}$/,
                                                message: "Invalid Indian PIN code (6 digits required)"
                                            },
                                            validate: value => {
                                                if (!value && document.getElementById('address').value) {
                                                    return "Please enter PIN code manually";
                                                }
                                                return true;
                                            }
                                        })}
                                        className="modern-input"
                                    // placeholder="Enter 6-digit PIN code"
                                    />
                                    {errors.zip && <span className="error-message">{errors.zip.message}</span>}
                                    <p className="input-hint">If not auto-filled, please enter manually</p>
                                </div>
                            </div>
                            {/* Save Address Checkbox */}
                            {user && (
                                <div className="form-group">
                                    <label className="save-address">
                                        <input
                                            type="checkbox"
                                            {...register("saveAddress")}
                                            className="checkbox-input"
                                        />
                                        Save this address for future orders
                                    </label>
                                </div>
                            )}
                        </section>
                    </div>



                    <div className="order-summary">
                        <h2 className="section-title">Order Summary</h2>
                        <div className="order-items">
                            {cart.items.map(item => (
                                <div key={item._id} className="order-item">
                                    <img src={item.images[0]?.url} alt={item.name} />
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p>Qty: {item.quantity}</p>
                                        <p>₹{(item.discountPrice || item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="total-section">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>
                                    ₹{cart.items.reduce((sum, item) =>
                                        sum + item.price * item.quantity, 0
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {cart.coupon && (
                                <div className="total-row discount-row">
                                    <span>Discount ({cart.coupon.code})</span>
                                    <span>-₹{cart.coupon.discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="total-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>
                                    ₹{(
                                        cart.items.reduce((sum, item) =>
                                            sum + (item.discountPrice || item.price) * item.quantity, 0
                                        ) - (cart.coupon?.discount || 0)
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.items.length === 0}
                            className="payment-button"
                        >
                            {loading ? <div className="spinner"></div> : 'Proceed to Pay'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;