import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const profileRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



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

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    if (!mounted) return null;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo Section - Removed motion */}
                    <div className="logo">
                        <Link to="/" className="logo-link">
                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
                        </Link>
                    </div>

                    {/* Desktop Navigation - Removed motion */}
                    <div className="nav-links">
                        {navItems.map((item) => (
                            <div key={item.name}>
                                <Link
                                    to={item.path}
                                    className="nav-item"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                    <div className="underline" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Action Icons - Removed motion */}
                    <div className="action-section">
                        <button
                            className="icon-btn"
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <FiSearch />
                        </button>

                        <Link to="/cart" className="icon-btn">
                            <FiShoppingCart />
                            {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        </Link>

                        <div className="profile-section" ref={profileRef}>
                            {user ? (
                                <>
                                    <button
                                        className="icon-btn"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <FaUser />
                                    </button>
                                    {isProfileOpen && (
                                        <div className="profile-dropdown">
                                            <Link to="/profile" className="profile-item">
                                                <FaUser className='icon' /> Profile
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="profile-item">
                                                    <RiAdminFill className='icon' /> Admin
                                                </Link>
                                            )}
                                            <button onClick={logout} className="profile-item">
                                                <FaSignOutAlt className='icon' /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/login" className="sign-in">
                                    <FaUser className='icon' />
                                </Link>
                            )}
                        </div>



                        <button
                            className="menu-toggle"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Search Bar */}
                    {searchOpen && (
                        <div className="navbar-search-container">
                            <input type="text" placeholder="Search..." />
                            <button
                                className="close-search"
                                onClick={() => setSearchOpen(false)}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="mobile-menu">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="mobile-item"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            <div className="content-wrapper">
                {/* Your page content here */}
            </div>
        </>
    );
};

export default Header;