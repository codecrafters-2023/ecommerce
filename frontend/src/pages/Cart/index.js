import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, Truck, ShieldCheck, Tag, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, applyCoupon, isAuthenticated, fetchCart, loading } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);
    const [localCart, setLocalCart] = useState({ items: [], totalAfterDiscount: 0 });
    const navigate = useNavigate();

    // Sync local cart with context cart
    useEffect(() => {
        console.log('Cart context updated:', cart);
        if (cart && cart.items) {
            setLocalCart({
                items: cart.items || [],
                totalAfterDiscount: cart.totalAfterDiscount || 0,
                coupon: cart.coupon || null
            });
        }
    }, [cart]);

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
        // First check for product discount price
        if (item?.product?.discountPrice !== undefined) {
            return parseFloat(item.product.discountPrice);
        }
        // Then check for item discount price
        else if (item?.discountPrice !== undefined) {
            return parseFloat(item.discountPrice);
        }
        // Then check for product regular price
        else if (item?.product?.price !== undefined) {
            return parseFloat(item.product.price);
        }
        // Then check for item regular price
        else if (item?.price !== undefined) {
            return parseFloat(item.price);
        }
        // Default to 0 if no price found
        return 0;
    };

    // Helper function to get item weight (if available)
    const getItemWeight = (item) => {
        return item?.product?.weight || item?.weight || '500g';
    };

    // Helper function to get original price (for discounts)
    const getItemOriginalPrice = (item) => {
        // First check for discount price, then regular price
        if (item?.product?.discountPrice !== undefined) {
            return parseFloat(item.product.discountPrice);
        } else if (item?.discountPrice !== undefined) {
            return parseFloat(item.discountPrice);
        } else if (item?.product?.price !== undefined) {
            return parseFloat(item.product.price);
        } else if (item?.price !== undefined) {
            return parseFloat(item.price);
        }
        return 0;
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            return;
        }

        setApplyingPromo(true);
        try {
            await applyCoupon(promoCode);
            setPromoCode('');
        } catch (error) {
            console.error('Failed to apply promo:', error);
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        // You'll need to add a removeCoupon function to your CartContext
        applyCoupon('');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleRefreshCart = async () => {
        await fetchCart();
    };

    // Get cart items safely
    const cartItems = localCart.items || [];

    // Calculate subtotal safely
    const calculateSubtotal = () => {
        if (!cartItems || cartItems.length === 0) return 0;

        return cartItems.reduce((sum, item) => {
            const price = getItemPrice(item);
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    };

    // Calculate discount safely
    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();

        if (localCart.coupon && localCart.coupon.discount) {
            // If coupon has a fixed discount amount
            if (localCart.coupon.discountType === 'fixed') {
                return Math.min(localCart.coupon.discount, subtotal);
            }
            // If coupon has percentage discount
            if (localCart.coupon.discountType === 'percentage') {
                return (subtotal * localCart.coupon.discount) / 100;
            }
            // Default to discount amount
            return localCart.coupon.discount;
        }

        return 0;
    };

    // Calculate shipping (free over ₹499)
    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        return subtotal >= 499 ? 0 : 40;
    };

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShipping();
    const total = subtotal - discount + shipping;

    // Show loading state
    if (loading) {
        return (
            <>
                <Header />
                <div className="bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-[#3B291A] animate-spin mx-auto mb-4" />
                        <p className="text-[#3B291A]">Loading cart...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <div className="bg-white min-h-screen">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-32 h-32 bg-[#FFF9E6] rounded-full flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-16 h-16 text-[#3B291A]/30" />
                            </div>
                            <h2 className="text-[#3B291A] text-3xl">Your Cart is Empty</h2>
                            <p className="text-[#3B291A]/60 max-w-md mx-auto">
                                Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
                            </p>
                            <div className="space-y-4">
                                <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-6">
                                    Continue Shopping
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleRefreshCart}
                                    className="block mx-auto text-[#4F8F3C] hover:underline"
                                >
                                    Refresh Cart
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-[#3B291A]/60 mb-8">
                        <Link to="/" className="hover:text-[#4F8F3C]">Home</Link>
                        <span>/</span>
                        <span className="text-[#3B291A]">Shopping Cart</span>
                    </div>

                    {/* Page Title */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[#3B291A] mb-2 text-3xl">Shopping Cart</h1>
                                <p className="text-[#3B291A]/60">
                                    You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                                </p>
                            </div>
                            <button
                                onClick={handleRefreshCart}
                                className="flex items-center gap-2 text-[#4F8F3C] hover:text-[#3d7230] transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, index) => {
                                const itemId = item._id || `item-${index}`;
                                const imageUrl = getItemImage(item);
                                const name = getItemName(item);
                                const currentPrice = getItemPrice(item); // Use current price (with discount if available)
                                const originalPrice = getItemOriginalPrice(item); // This might be the original price before discount
                                const weight = getItemWeight(item);
                                const quantity = item.quantity || 1;

                                // Calculate the effective price to display
                                const displayPrice = currentPrice;
                                const displayOriginalPrice = originalPrice;
                                const hasDiscount = displayOriginalPrice > 0 && displayOriginalPrice > displayPrice;

                                return (
                                    <motion.div
                                        key={itemId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#F3D35C]/20 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="w-32 h-32 bg-[#FFF9E6] rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-[#F3D35C]/20">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={name}
                                                        className="w-24 h-24 object-contain"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <ShoppingBag className="w-16 h-16 text-[#3B291A]/30" />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="text-[#3B291A] font-semibold text-lg mb-1">{name}</h3>
                                                        <p className="text-[#3B291A]/60 text-sm">Weight: {weight}</p>
                                                        <p className="text-[#3B291A]/60 text-sm">
                                                            Price: ₹{displayPrice.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(itemId)}
                                                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-[#3B291A]/40 group-hover:text-red-500" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center bg-[#FFF9E6] rounded-full border-2 border-[#F3D35C]/30">
                                                        <button
                                                            onClick={() => updateQuantity(itemId, quantity - 1)}
                                                            disabled={quantity <= 1}
                                                            className="p-2 hover:bg-[#F3D35C]/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="w-4 h-4 text-[#3B291A]" />
                                                        </button>
                                                        <span className="w-12 text-center font-medium text-[#3B291A]">{quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(itemId, quantity + 1)}
                                                            className="p-2 hover:bg-[#F3D35C]/20 rounded-full transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 text-[#3B291A]" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-[#3B291A] font-bold text-xl">
                                                            ₹{(displayPrice * quantity).toFixed(2)}
                                                        </p>
                                                        {hasDiscount && displayOriginalPrice > displayPrice && (
                                                            <p className="text-[#3B291A]/40 line-through text-sm">
                                                                ₹{(displayOriginalPrice * quantity).toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Free Shipping Banner */}
                            {subtotal < 499 && (
                                <div className="bg-gradient-to-r from-[#8CCB5E]/10 to-[#4F8F3C]/10 p-4 rounded-2xl border-2 border-[#8CCB5E]/30">
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-6 h-6 text-[#4F8F3C]" />
                                        <p className="text-[#3B291A] text-sm">
                                            Add <span className="font-bold text-[#4F8F3C]">₹{(499 - subtotal).toFixed(2)}</span> more to get <span className="font-bold">FREE SHIPPING!</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-[#FFF9E6] to-white p-8 rounded-3xl shadow-lg border-2 border-[#F3D35C]/30 sticky top-24 space-y-6">
                                <h2 className="text-[#3B291A] font-bold text-2xl">Order Summary</h2>

                                {/* Promo Code */}
                                <div className="space-y-3">
                                    <label className="text-[#3B291A] font-medium text-sm flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Promo Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            disabled={!isAuthenticated || localCart.coupon}
                                            className="flex-1 px-4 py-3 border-2 border-[#F3D35C]/30 rounded-2xl focus:outline-none focus:border-[#4F8F3C] text-[#3B291A] disabled:bg-gray-100"
                                        />
                                        {localCart.coupon ? (
                                            <button
                                                onClick={handleRemovePromo}
                                                className="px-6 py-3 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyPromo}
                                                disabled={!isAuthenticated || applyingPromo || !promoCode.trim()}
                                                className="px-6 py-3 bg-[#4F8F3C] text-white rounded-2xl font-medium hover:bg-[#3d7230] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {applyingPromo ? 'Applying...' : 'Apply'}
                                            </button>
                                        )}
                                    </div>
                                    {localCart.coupon && (
                                        <p className="text-[#4F8F3C] text-sm font-medium flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            {localCart.coupon.code} applied! You saved ₹{discount.toFixed(2)}
                                        </p>
                                    )}
                                    {!isAuthenticated && (
                                        <p className="text-[#3B291A]/60 text-sm">
                                            <Link to="/login" className="text-[#4F8F3C] hover:underline">Login</Link> to apply coupons
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4 py-6 border-t-2 border-b-2 border-[#F3D35C]/20">
                                    <div className="flex justify-between text-[#3B291A]/80">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#3B291A]/80">
                                        <span className="flex items-center gap-2">
                                            Delivery
                                            {shipping === 0 && <span className="text-xs bg-[#8CCB5E] text-white px-2 py-1 rounded-full">FREE</span>}
                                        </span>
                                        <span className="font-medium">
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-[#4F8F3C]">
                                            <span>Discount</span>
                                            <span className="font-medium">-₹{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-[#3B291A]">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl">₹{total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                {/* Trust Badges */}
                                <div className="space-y-3 pt-4">
                                    <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                                        <ShieldCheck className="w-5 h-5 text-[#4F8F3C] flex-shrink-0" />
                                        <span>Secure Payment by Razorpay</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                                        <Package className="w-5 h-5 text-[#4F8F3C] flex-shrink-0" />
                                        <span>Quality Packaging & Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                                        <Truck className="w-5 h-5 text-[#4F8F3C] flex-shrink-0" />
                                        <span>Delivered by Delhivery</span>
                                    </div>
                                </div>

                                {/* Partner Logos Section */}
                                <div className="pt-4 border-t-2 border-[#F3D35C]/20">
                                    <p className="text-[#3B291A]/60 text-xs mb-4 text-center">Trusted Partners</p>
                                    <div className="flex items-center justify-around gap-4">
                                        {/* Razorpay Logo Placeholder */}
                                        <div className="bg-white px-4 py-3 rounded-xl border-2 border-[#F3D35C]/20 flex items-center justify-center flex-1">
                                            <div className="text-[#3B291A] font-bold text-sm text-center">
                                                <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-[#528FF0]" />
                                                <span className="text-xs">Razorpay</span>
                                            </div>
                                        </div>
                                        {/* Delhivery Logo */}
                                        <div className="bg-white px-4 py-3 rounded-xl border-2 border-[#F3D35C]/20 flex items-center justify-center flex-1">
                                            <div className="text-[#3B291A] font-bold text-sm text-center">
                                                <Truck className="w-8 h-8 mx-auto mb-1 text-[#E7272D]" />
                                                <span className="text-xs">Delhivery</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-12 text-center">
                        <Link to="/shop" className="btn-secondary inline-flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 rotate-180" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;