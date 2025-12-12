import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

  // -------------------------
  // 1️⃣ FETCH CART FROM BACKEND
  // -------------------------
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const backendItems = response.data.cart.items;

      const mapped = backendItems.map((item) => ({
        id: item._id,
        name: item.name,
        image: item.images?.[0]?.url,
        price: item.price,
        count: item.quantity,
        weight: item.weight || null,
      }));

      setCartItems(mapped);
    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // -------------------------
  // 2️⃣ UPDATE QUANTITY (BACKEND + UI)
  // -------------------------
  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;

    try {
      await axios.post(
        `${API_URL}/cart/update`,
        { productId: id, quantity: newQty },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, count: newQty } : item
        )
      );
    } catch (err) {
      console.log("Update qty failed:", err);
    }
  };

  // -------------------------
  // 3️⃣ REMOVE ITEM (BACKEND + UI)
  // -------------------------
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("Remove failed:", err);
    }
  };

  // -------------------------
  // 4️⃣ CALCULATIONS
  // -------------------------
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryCharge - discount;

  // -------------------------
  // 5️⃣ APPLY COUPON FROM BACKEND
  // -------------------------
  const applyCoupon = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/app/apply-coupon`,
        { code: promoCode },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setDiscount(response.data.coupon.discount);
        setAppliedPromo(promoCode);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid coupon");
    }
  };

  const handleCheckout = () => navigate("/checkout");

  // -----------------------------------
  //  EMPTY CART UI
  // -----------------------------------
  if (cartItems.length === 0) {
    return (
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
              Looks like you haven’t added any products yet.
            </p>

            <Link
              to="/shop"
              className="btn-primary inline-flex items-center gap-2 mt-6"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // -----------------------------------
  //  MAIN CART UI
  // -----------------------------------
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#3B291A]/60 mb-8">
          <Link to="/" className="hover:text-[#4F8F3C]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#3B291A]">Shopping Cart</span>
        </div>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-[#3B291A] mb-2 text-3xl">Shopping Cart</h1>
          <p className="text-[#3B291A]/60">
            You have {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE – CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#F3D35C]/20"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-[#FFF9E6] rounded-2xl flex items-center justify-center border-2 border-[#F3D35C]/20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-3">
                      <h3 className="text-[#3B291A] font-semibold text-lg">
                        {item.name}
                      </h3>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-[#FFF9E6] rounded-full border-2 border-[#F3D35C]/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.count - 1)}
                          className="p-2"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-12 text-center font-medium">
                          {item.count}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.count + 1)}
                          className="p-2"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-[#3B291A] font-bold text-xl">
                        ₹{item.price * item.count}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE – ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#FFF9E6] to-white p-8 rounded-3xl shadow-lg border-2 border-[#F3D35C]/30 sticky top-24 space-y-6">
              <h2 className="text-[#3B291A] font-bold text-2xl">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="space-y-3">
                <label className="text-[#3B291A] font-medium flex gap-2">
                  <Tag className="w-4 h-4" /> Promo Code
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={appliedPromo !== null}
                    className="flex-1 px-4 py-3 border-2 rounded-2xl"
                    placeholder="Enter code"
                  />

                  {!appliedPromo ? (
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-3 bg-[#4F8F3C] text-white rounded-2xl"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAppliedPromo(null);
                        setDiscount(0);
                        setPromoCode("");
                      }}
                      className="px-6 py-3 bg-red-500 text-white rounded-2xl"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {discount > 0 && (
                  <p className="text-[#4F8F3C] font-medium">
                    Coupon applied! You saved ₹{discount}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-4 py-6 border-t border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#4F8F3C]">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-2xl">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                  <ShieldCheck className="w-5 h-5 text-[#4F8F3C]" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                  <Package className="w-5 h-5 text-[#4F8F3C]" />
                  <span>Quality Packaging</span>
                </div>
                <div className="flex items-center gap-3 text-[#3B291A]/80 text-sm">
                  <Truck className="w-5 h-5 text-[#4F8F3C]" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5 rotate-180" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
