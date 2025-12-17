import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAfterDiscount: 0 });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Fetch cart for authenticated users
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
      setCart(guestCart);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const validatedCart = {
        items: data.items || [],
        totalAfterDiscount: data.totalAfterDiscount || 0,
        coupon: data.coupon?.code ? data.coupon : null,
        _version: Date.now()
      };

      setCart(validatedCart);
    } catch (error) {
      // If unauthorized, clear token and use guest cart
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
        setCart(guestCart);
      } else {
        setCart({
          items: [],
          totalAfterDiscount: 0,
          coupon: null,
          _version: Date.now()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData) => {
    localStorage.setItem('guestCart', JSON.stringify(cartData));
  };

  const addToCart = async (productId, quantity = 1, productDetails = null) => {
    const token = localStorage.getItem('token');
    
    // If not authenticated, add to guest cart
    if (!token) {
      try {
        // Fetch product details if not provided
        let productInfo = productDetails;
        if (!productInfo) {
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/products/${productId}`);
          productInfo = {
            _id: data._id,
            name: data.name,
            price: data.discountPrice,
            images: data.images,
            quantity: data.quantity
          };
        }

        // Update guest cart in localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
        
        // Check if product already exists in cart
        const existingItemIndex = guestCart.items.findIndex(item => item.product?._id === productId);
        
        if (existingItemIndex > -1) {
          // Update quantity
          guestCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          guestCart.items.push({
            _id: `guest_${Date.now()}`,
            product: productInfo,
            quantity: quantity
          });
        }

        // Calculate total
        guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
          return total + (item.product?.price || 0) * item.quantity;
        }, 0);

        // Save to localStorage
        saveGuestCart(guestCart);
        setCart(guestCart);
        
        toast.success('Product added to cart!');
        return;
      } catch (error) {
        console.error('Error adding to guest cart:', error);
        toast.error('Failed to add product to cart');
        return;
      }
    }

    // If authenticated, use API
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchCart();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        toast.error('Session expired. Added to guest cart.');
        // Retry as guest
        await addToCart(productId, quantity, productDetails);
      }
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    const quantity = Math.max(newQuantity, 1);

    if (!token) {
      // Update guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
      const itemIndex = guestCart.items.findIndex(item => item._id === itemId);
      
      if (itemIndex > -1) {
        guestCart.items[itemIndex].quantity = quantity;
        
        // Recalculate total
        guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
          return total + (item.product?.price || 0) * item.quantity;
        }, 0);
        
        saveGuestCart(guestCart);
        setCart(guestCart);
      }
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Remove from guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
      guestCart.items = guestCart.items.filter(item => item._id !== itemId);
      
      // Recalculate total
      guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0);
      
      saveGuestCart(guestCart);
      setCart(guestCart);
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Clear guest cart
      const emptyCart = {
        items: [],
        totalAfterDiscount: 0,
        coupon: null,
        _version: Date.now()
      };
      saveGuestCart(emptyCart);
      setCart(emptyCart);
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const resetCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      clearCart();
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error resetting cart:', error);
    }
  };

  // Guest functions (simplified for coupons)
  const applyCoupon = async (code) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.info('Please login to apply coupons');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/apply-coupon`,
        { code },
        { headers: { Authorization: `Bearer ${token}` }}
      );
  
      if (response.data.success) {
        await fetchCart();
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying coupon');
    }
  };

  const removeCoupon = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.info('Please login to manage coupons');
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/coupon`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  // Merge guest cart with user cart on login
  const mergeGuestCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": []}');
    const token = localStorage.getItem('token');
    
    if (token && guestCart.items.length > 0) {
      try {
        // Add all guest cart items to user cart
        for (const item of guestCart.items) {
          if (item.product?._id) {
            await axios.post(`${process.env.REACT_APP_API_URL}/cart`,
              { productId: item.product._id, quantity: item.quantity },
              { headers: { Authorization: `Bearer ${token}` }}
            );
          }
        }
        
        // Clear guest cart
        localStorage.removeItem('guestCart');
        await fetchCart();
      } catch (error) {
        console.error('Error merging cart:', error);
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
        clearCart,
        applyCoupon,
        removeCoupon,
        resetCart,
        mergeGuestCart,
        isAuthenticated,
        cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);