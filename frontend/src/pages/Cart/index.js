import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './index.css';
import Header from '../../components/header';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const applyCoupon = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/cart/apply-coupon`,
                { code: couponCode },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
            );
    
            if (response.data.success) {
                setDiscount(response.data.coupon.discount);
                toast.success('Coupon applied successfully!');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error applying coupon';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <Header />
            <div className="cart-container">
                <h1>Your Shopping Cart</h1>
                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Your cart feels light... Let's add some items!</p>
                        <Link to="/shop" className="empty-cart-link">Explore Products</Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.items.map(item => (
                                <div key={item._id} className="cart-item">
                                    <img src={item.images[0]?.url} alt={item.name} />
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p>₹{item.price}</p>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className="remove-button"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-total">
                            <h3>Total: ₹
                                {(cart.items.reduce((sum, item) =>
                                    sum + (item.price * item.quantity), 0) - discount).toFixed(2)}
                            </h3>
                            <button className="checkout-button"><Link to={'/checkout'}>Secure Checkout</Link></button>
                        </div>
                        <div className="coupon-section">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                            />
                            <button onClick={applyCoupon}>Apply Coupon</button>
                            {discount > 0 && <p>Discount applied: ₹{discount.toFixed(2)}</p>}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Cart;