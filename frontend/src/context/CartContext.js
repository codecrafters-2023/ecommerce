import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAfterDiscount: 0 });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status - SIMPLE AND RELIABLE
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('Auth check - Token exists:', !!token, 'Setting isAuth to:', isAuth);
    setIsAuthenticated(isAuth);
    return isAuth;
  }, []);



  // Fetch cart - SIMPLIFIED VERSION
  // const fetchCart = useCallback(async () => {
  //   setLoading(true);
  //   const token = localStorage.getItem('token');
  //   const isAuth = !!token;

  //   try {
  //     if (!isAuth) {
  //       // Load guest cart from localStorage
  //       const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
  //       setCart(guestCart);
  //     } else {
  //       // Fetch authenticated cart
  //       const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });

  //       const validatedCart = {
  //         items: data.items || [],
  //         totalAfterDiscount: data.totalAfterDiscount || 0,
  //         coupon: data.coupon?.code ? data.coupon : null,
  //       };

  //       setCart(validatedCart);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching cart:', error);

  //     // If unauthorized, fall back to guest cart
  //     if (error.response?.status === 401) {
  //       localStorage.removeItem('token');
  //       checkAuthStatus();
  //       const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
  //       setCart(guestCart);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [checkAuthStatus]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const isAuth = !!token;

    console.log('fetchCart called, isAuth:', isAuth, 'token exists:', !!token);

    try {
      if (!isAuth) {
        // Load guest cart from localStorage - FIXED
        const guestCartStr = localStorage.getItem('guestCart');
        console.log('Loading guest cart from localStorage:', guestCartStr);

        let guestCart;
        if (guestCartStr) {
          try {
            guestCart = JSON.parse(guestCartStr);
          } catch (e) {
            console.error('Error parsing guestCart:', e);
            guestCart = { items: [], totalAfterDiscount: 0, coupon: null };
          }
        } else {
          guestCart = { items: [], totalAfterDiscount: 0, coupon: null };
        }

        // Ensure proper structure
        if (!guestCart.items) guestCart.items = [];
        if (guestCart.totalAfterDiscount === undefined) guestCart.totalAfterDiscount = 0;
        if (!guestCart.coupon) guestCart.coupon = null;

        console.log('Setting guest cart:', guestCart);
        setCart(guestCart);
      } else {
        // Fetch authenticated cart
        console.log('Fetching authenticated cart...');
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Cart API response:', data);

        const validatedCart = {
          items: data.items || [],
          totalAfterDiscount: data.totalAfterDiscount || 0,
          coupon: data.coupon?.code ? data.coupon : null,
        };

        console.log('Validated cart:', validatedCart);
        setCart(validatedCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);

      // Fall back to guest cart
      const guestCartStr = localStorage.getItem('guestCart');
      const guestCart = guestCartStr ? JSON.parse(guestCartStr) : { items: [], totalAfterDiscount: 0, coupon: null };
      if (!guestCart.items) guestCart.items = [];
      setCart(guestCart);
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  // Listen for auth changes from anywhere in the app
  useEffect(() => {
    // Check on mount
    checkAuthStatus();

    // Create a custom event listener for auth changes
    const handleAuthChange = (event) => {
      console.log('Auth change detected, fetching cart...');
      setTimeout(async () => {
        const isAuth = checkAuthStatus();
        if (isAuth && event.detail?.shouldMergeCart) {
          // Merge guest cart with user cart
          await mergeGuestCart();
        }
        await fetchCart();
      }, 100);
    };

    // Listen for multiple events that indicate auth changes
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('login-success', handleAuthChange);
    window.addEventListener('logout', handleAuthChange);

    // Also check periodically (fallback)
    const interval = setInterval(checkAuthStatus, 5000);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('login-success', handleAuthChange);
      window.removeEventListener('logout', handleAuthChange);
      clearInterval(interval);
    };
  }, [checkAuthStatus, fetchCart]);

  // Save guest cart
  const saveGuestCart = useCallback((cartData) => {
    localStorage.setItem('guestCart', JSON.stringify(cartData));
  }, []);

  // Add to cart
  const addToCart = useCallback(async (productId, quantity = 1, productDetails = null) => {
    const token = localStorage.getItem('token');
    const isAuth = !!token;

    if (!isAuth) {
      // Guest cart logic - FIXED to prevent duplicates
      try {
        let productInfo = productDetails;
        if (!productInfo) {
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/products/${productId}`);
          productInfo = {
            _id: data._id,
            name: data.name,
            price: data.discountPrice || data.price,
            images: data.images,
            weight: data.weight || '500g'
          };
        }

        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');

        // Check if product already exists
        const existingItemIndex = guestCart.items.findIndex(item => {
          const itemProductId = item.product?._id || item.productId;
          return itemProductId === productId;
        });

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          guestCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          guestCart.items.push({
            _id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            product: productInfo,
            quantity: quantity
          });
        }

        guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
          return total + (item.product?.price || 0) * item.quantity;
        }, 0);

        saveGuestCart(guestCart);
        setCart(guestCart);
        toast.success('Product added to cart!');
      } catch (error) {
        console.error('Error adding to guest cart:', error);
        toast.error('Failed to add product to cart');
      }
      return;
    }

    // Authenticated cart logic
    try {
      console.log('Adding to cart as authenticated user');

      // If we have product details from frontend, use the simple endpoint
      if (productDetails) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/simple`,
          {
            productId,
            quantity,
            productDetails: {
              price: productDetails.discountPrice || productDetails.price,
              name: productDetails.name,
              images: productDetails.images || []
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Try to get product details first, then use simple endpoint
        try {
          const { data: product } = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/products/${productId}`
          );

          await axios.post(
            `${process.env.REACT_APP_API_URL}/cart/simple`,
            {
              productId,
              quantity,
              productDetails: {
                price: product.discountPrice || product.price,
                name: product.name,
                images: product.images || []
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (productError) {
          console.error('Error fetching product details:', productError);
          // Fallback to regular endpoint
          await axios.post(
            `${process.env.REACT_APP_API_URL}/cart`,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      await fetchCart();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Handle specific errors
      if (error.response?.status === 500 &&
        error.response?.data?.message?.includes('Product model not found')) {
        // Try alternative approach without Product model dependency
        toast.info('Please try adding the product again');
      } else {
        toast.error('Failed to add product to cart');
      }
    }
  }, [fetchCart, saveGuestCart]);

  // Update quantity
  // const updateQuantity = useCallback(async (itemId, newQuantity) => {
  //   const token = localStorage.getItem('token');
  //   const quantity = Math.max(newQuantity, 1);

  //   if (!token) {
  //     const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
  //     const itemIndex = guestCart.items.findIndex(item => item._id === itemId);

  //     if (itemIndex > -1) {
  //       guestCart.items[itemIndex].quantity = quantity;
  //       guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
  //         return total + (item.product?.price || 0) * item.quantity;
  //       }, 0);

  //       saveGuestCart(guestCart);
  //       setCart(guestCart);
  //     }
  //     return;
  //   }

  //   try {
  //     await axios.put(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, { quantity }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     await fetchCart();
  //   } catch (error) {
  //     console.error('Error updating quantity:', error);
  //   }
  // }, [fetchCart, saveGuestCart]);

  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    const quantity = Math.max(newQuantity, 1);

    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');

      // Find the item to update
      const itemToUpdate = guestCart.items.find(item => item._id === itemId);
      if (!itemToUpdate) return;

      // Update quantity
      itemToUpdate.quantity = quantity;

      // Recalculate total
      guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0);

      saveGuestCart(guestCart);
      setCart(guestCart);
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [fetchCart, saveGuestCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (itemId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
      guestCart.items = guestCart.items.filter(item => item._id !== itemId);
      guestCart.totalAfterDiscount = guestCart.items.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity;
      }, 0);

      saveGuestCart(guestCart);
      setCart(guestCart);
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }, [fetchCart, saveGuestCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      const emptyCart = { items: [], totalAfterDiscount: 0, coupon: null };
      saveGuestCart(emptyCart);
      setCart(emptyCart);
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [], totalAfterDiscount: 0, coupon: null });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [saveGuestCart]);

  // Reset cart (remove coupon)
  const resetCart = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"items": [], "totalAfterDiscount": 0}');
      guestCart.coupon = null;
      saveGuestCart(guestCart);
      setCart(guestCart);
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
  }, [fetchCart, saveGuestCart]);

  // Apply coupon
  const applyCoupon = useCallback(async (code) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.info('Please login to apply coupons');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/apply-coupon`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchCart();
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying coupon');
    }
  }, [fetchCart]);

  // Remove coupon
  const removeCoupon = useCallback(async () => {
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
  }, [fetchCart]);

  // Merge guest cart with user cart
  const mergeGuestCart = useCallback(async () => {
    try {
      const guestCartData = localStorage.getItem('guestCart');

      // If no guest cart, nothing to merge
      if (!guestCartData) {
        console.log('No guest cart to merge');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token available for merge');
        return;
      }

      // Parse guest cart
      let guestCart;
      try {
        guestCart = JSON.parse(guestCartData);
      } catch (e) {
        console.error('Error parsing guest cart:', e);
        return;
      }

      // If guest cart is empty, nothing to merge
      if (!guestCart.items || guestCart.items.length === 0) {
        console.log('Guest cart is empty');
        localStorage.removeItem('guestCart'); // Clean up
        return;
      }

      console.log('Starting cart merge, guest items:', guestCart.items.length);

      // First, get the user's current cart
      let userCart;
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userCart = data;
      } catch (error) {
        console.error('Error fetching user cart:', error);
        return;
      }

      // Create a map to track product quantities in guest cart
      const guestProductMap = new Map();

      // Group and sum quantities from guest cart
      guestCart.items.forEach(guestItem => {
        const productId = guestItem.product?._id || guestItem.productId;
        if (productId) {
          const existingQuantity = guestProductMap.get(productId) || 0;
          const guestQuantity = guestItem.quantity || 1;
          guestProductMap.set(productId, existingQuantity + guestQuantity);
        }
      });

      // Create a map for user's existing products
      const userProductMap = new Map();
      if (userCart.items && userCart.items.length > 0) {
        userCart.items.forEach(userItem => {
          const productId = userItem.product?._id ||
            (typeof userItem.product === 'string' ? userItem.product : null);
          if (productId) {
            userProductMap.set(productId, {
              cartItemId: userItem._id,
              currentQuantity: userItem.quantity || 1
            });
          }
        });
      }

      // Process each unique product from guest cart
      const mergePromises = [];
      let mergeCount = 0;

      for (const [productId, guestQuantity] of guestProductMap.entries()) {
        if (userProductMap.has(productId)) {
          // Product exists in user's cart - UPDATE quantity
          const userItem = userProductMap.get(productId);
          const newQuantity = userItem.currentQuantity + guestQuantity;

          // Only update if quantity is different
          if (newQuantity !== userItem.currentQuantity) {
            mergePromises.push(
              axios.put(
                `${process.env.REACT_APP_API_URL}/cart/${userItem.cartItemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
              ).then(() => {
                console.log(`Updated product ${productId} quantity to ${newQuantity}`);
                mergeCount++;
              }).catch(err => {
                console.error(`Error updating product ${productId}:`, err);
              })
            );
          }
        } else {
          // Product doesn't exist - ADD new item
          // First, get product details
          try {
            const { data: product } = await axios.get(
              `${process.env.REACT_APP_API_URL}/users/products/${productId}`
            );

            mergePromises.push(
              axios.post(
                `${process.env.REACT_APP_API_URL}/cart/simple`,
                {
                  productId: productId,
                  quantity: guestQuantity,
                  productDetails: {
                    price: product.discountPrice || product.price,
                    name: product.name,
                    images: product.images || []
                  }
                },
                { headers: { Authorization: `Bearer ${token}` } }
              ).then(() => {
                console.log(`Added product ${productId} with quantity ${guestQuantity}`);
                mergeCount++;
              }).catch(err => {
                console.error(`Error adding product ${productId}:`, err);
              })
            );
          } catch (error) {
            console.error(`Error fetching product ${productId} details:`, error);
          }
        }
      }

      // Wait for all operations to complete
      if (mergePromises.length > 0) {
        await Promise.all(mergePromises);
        console.log(`Merged ${mergeCount} unique products from guest cart`);
      } else {
        console.log('No new products to merge');
      }

      // Clear guest cart ONLY after successful merge
      localStorage.removeItem('guestCart');

      // Fetch updated cart
      await fetchCart();

      // Show success message
      if (mergeCount > 0) {
        toast.success(`Merged ${mergeCount} item(s) from your guest cart!`);
      }

      await cleanupDuplicateCartItems();

    } catch (error) {
      console.error('Error in mergeGuestCart:', error);
      toast.error('Failed to merge cart. Please try again.');
    }
  }, [fetchCart]);

  // Initial fetch
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Function to force auth check from anywhere
  const checkAuth = useCallback(() => {
    return checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const cleanupCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/cart/clean-duplicates`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Error cleaning cart on load:', error);
        }
      }
    };

    cleanupCart();
  }, []);


  // In your CartContext.js, add this function if it doesn't exist
  const cleanupDuplicateCartItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      console.log('Cleaning up duplicate cart items...');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/clean-duplicates`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log(`Cleaned ${response.data.cleanedCount || 0} duplicate items`);
        await fetchCart();
      }
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
    }
  }, [fetchCart]);

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
        fetchCart,
        checkAuth,
        cleanupDuplicateCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};