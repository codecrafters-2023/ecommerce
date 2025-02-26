import React, { useState } from 'react';
import { FaBars, FaTimes, FaSearch, FaUser, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './index.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = ({ onSearch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Toggle Profile Dropdown
    const { user, logout } = useAuth(); 
    const { cartCount } = useCart(); // Get cart count from context
    const [searchTerm, setSearchTerm] = useState("");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <header className="header">
            <div className="container">
                {/* Logo */}
                <div className="logo">Ecommerce</div>

                {/* Navigation Menu */}
                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/about">About</Link>
                    <Link to="/Contact">Contact</Link>
                </nav>

                {/* Right Section */}
                <div className="right-section">
                    {/* Search Bar */}
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {user?.role === 'admin' && (
                        <div className="admin-links">
                            <Link to="/admin">Admin</Link>
                        </div>
                    )}

                    {/* User Profile Section */}
                    <div className="icons">
                        {user ? (
                            // If user is logged in, show profile icon & name
                            <div className="profile-section">
                                <div className="profile-icon" onClick={toggleProfile}>
                                    <FaUser className="icon" />
                                    <span className="username">{user?.name}</span>
                                </div>

                                {/* Profile Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="profile-dropdown">
                                        <Link to="/profile">Profile</Link>
                                        <button onClick={logout}>
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // If user is not logged in, show login icon
                            <Link to={'/login'}><FaUser className="icon" /></Link>
                        )}

                        {/* Cart Icon with Dynamic Count */}
                        <div className="cart-icon relative">
                            <Link to="/cart">
                                <FaShoppingCart className="icon" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="menu-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
