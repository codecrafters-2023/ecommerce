import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading] = useState(true);
  

  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
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
    } catch (error) {
      console.error('Error updating quantity:', error);
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

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);