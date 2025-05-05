// src/components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Instant scroll to top without animation
        window.scrollTo({
            top: 0,
            behavior: 'auto' // 👈 This disables smooth scrolling
        });

        // Double safeguard for older browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
};

export default ScrollToTop;