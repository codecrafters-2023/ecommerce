import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const GuestCartMerger = () => {
    const { mergeGuestCart } = useCart();

    useEffect(() => {
        // Check if user just logged in (token exists but guest cart exists)
        const token = localStorage.getItem('token');
        const guestCart = localStorage.getItem('guestCart');
        
        if (token && guestCart) {
            mergeGuestCart();
        }
    }, [mergeGuestCart]);

    return null;
};

export default GuestCartMerger;