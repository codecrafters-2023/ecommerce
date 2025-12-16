import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(location.pathname !== '/');
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const profileRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Track scroll position to show/hide header on home page
    useEffect(() => {
        if (location.pathname === '/') {
            // Scroll to top on home page load/reload
            window.scrollTo(0, 0);
            setShowHeader(false); // Initially hide on home page
            
            const handleScroll = () => {
                const heroSection = document.getElementById('hero-section');
                if (heroSection) {
                    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                    setShowHeader(window.scrollY > heroBottom - 100);
                }
            };

            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Check initial position
            
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setShowHeader(true); // Always show on other pages
        }
    }, [location.pathname]);

    // Click outside handler for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Our Story', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    if (!mounted || !showHeader) return null;

    return (
        <>
            <header className="navbar">
                <div className="navbar-container">
                    <div>
                        <Link to="/" className="logo-link">
                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="FarFoo" className="header-logo-image" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <div className="desktop-search">
                        {/* <FiSearch className="search-icon" /> */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-input"
                        />
                    </div>

                    {/* Action Icons */}
                    <div className="action-section">
                        <Link to="/cart" className="cart-icon">
                            <FiShoppingCart className="cart-icon-svg" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>

                        <div className="profile-section" ref={profileRef}>
                            {user ? (
                                <>
                                    <button
                                        className="profile-icon"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <FaUser className="profile-icon-svg" />
                                        {user && (
                                            <span className="profile-indicator"></span>
                                        )}
                                    </button>
                                    {isProfileOpen && (
                                        <div className="profile-dropdown">
                                            <Link to="/profile" className="profile-item" onClick={() => setIsProfileOpen(false)}>
                                                <FaUser className='icon' /> Profile
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="profile-item" onClick={() => setIsProfileOpen(false)}>
                                                    <RiAdminFill className='icon' /> Admin
                                                </Link>
                                            )}
                                            <button onClick={() => { logout(); setIsProfileOpen(false); }} className="profile-item">
                                                <FaSignOutAlt className='icon' /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/login" className="profile-icon">
                                    <FaUser className="profile-icon-svg" />
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="mobile-menu">
                            <div className="mobile-menu-content">
                                {navLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Mobile Search */}
                                <div className="mobile-search-container">
                                    <div className="mobile-search">
                                        <FiSearch className="mobile-search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="mobile-search-input"
                                        />
                                    </div>
                                </div>

                                {/* Mobile User Links */}
                                <div className="mobile-user-links">
                                    <Link
                                        to="/cart"
                                        className="mobile-user-link"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FiShoppingCart className="mobile-link-icon" />
                                        <span>Cart</span>
                                        {cartCount > 0 && (
                                            <span className="mobile-cart-badge">{cartCount}</span>
                                        )}
                                    </Link>
                                    
                                    <Link
                                        to={user ? "/profile" : "/login"}
                                        className="mobile-user-link"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <FaUser className="mobile-link-icon" />
                                        <span>{user ? 'My Profile' : 'Login / Sign Up'}</span>
                                        {user && (
                                            <span className="mobile-profile-indicator"></span>
                                        )}
                                    </Link>
                                    
                                    {user && user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="mobile-user-link"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <RiAdminFill className="mobile-link-icon" />
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}
                                    
                                    {user && (
                                        <button 
                                            onClick={() => { logout(); setMobileMenuOpen(false); }}
                                            className="mobile-user-link"
                                        >
                                            <FaSignOutAlt className="mobile-link-icon" />
                                            <span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="content-wrapper">
                {/* Your page content here */}
            </div>
        </>
    );
};

export default Header;