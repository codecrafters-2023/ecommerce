import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';

const GuestCartMerger = () => {
    const { mergeGuestCart, cleanDuplicateCartItems, isAuthenticated } = useCart();
    const location = useLocation();

    useEffect(() => {
        // Check if user just logged in
        const token = localStorage.getItem('token');
        const guestCart = localStorage.getItem('guestCart');
        
        if (token && guestCart && !location.pathname.includes('/checkout')) {
            const mergeCart = async () => {
                await mergeGuestCart();
                
                // Only call cleanDuplicateCartItems if it exists and is a function
                if (cleanDuplicateCartItems && typeof cleanDuplicateCartItems === 'function') {
                    await cleanDuplicateCartItems();
                }
            };
            mergeCart();
        }
    }, [mergeGuestCart, cleanDuplicateCartItems, location.pathname, isAuthenticated]);

    return null;
};

export default GuestCartMerger;