import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAfterDiscount: 0 });
  const [loading] = useState(true);


  const fetchCart = async () => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Force reset if invalid coupon remains
        const validatedCart = {
            items: data.items || [],
            totalAfterDiscount: data.totalAfterDiscount || 0,
            coupon: data.coupon?.code ? data.coupon : null,
            _version: Date.now()
        };

        if (validatedCart.coupon && !validatedCart.items.length) {
            validatedCart.coupon = null;
            validatedCart.totalAfterDiscount = 0;
        }

        setCart(validatedCart);
    } catch (error) {
        setCart({
            items: [],
            totalAfterDiscount: 0,
            coupon: null,
            _version: Date.now()
        });
    }
};

const resetCart = async () => {
  await axios.post(`${process.env.REACT_APP_API_URL}/cart/reset`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  await fetchCart();
};

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      await fetchCart();

    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        toast.error('Please log in to add items to your cart');
        window.location.href = '/login';
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      // Ensure quantity doesn't go below 1
      const quantity = Math.max(newQuantity, 1);

      await axios.put(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state immediately for better UX
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        )
      }));
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      await fetchCart();
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));

    } catch (error) {
      console.error('Error removing item:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

const clearCart = async () => {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        // Force complete state reset with version update
        setCart({
            items: [],
            totalAfterDiscount: 0,
            coupon: null,
            _version: Date.now()
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
};

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/apply-coupon`,
        { code },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
  
      if (response.data.success) {
        // Use cart context to refresh data
        // const { fetchCart } = useCart();
        await fetchCart();
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying coupon');
    }
  };

  const removeCoupon = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/coupon`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Force complete cart refresh
      await fetchCart();
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        resetCart,
        cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);