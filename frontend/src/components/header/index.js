// import React, { useState } from 'react';
// import { FaBars, FaTimes, FaSearch, FaUser, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
// import './index.css';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';

// const Header = ({ onSearch }) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false); // Toggle Profile Dropdown
//     const { user, logout } = useAuth();
//     const { cartCount } = useCart();
//     const [searchTerm, setSearchTerm] = useState("");

// const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
// };

// const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
// };

//     const handleSearch = (e) => {
//         setSearchTerm(e.target.value);
//         if (onSearch) {
//             onSearch(e.target.value);
//         }
//     };



//     return (
//         <header className="header">
//             <div className="container">
//                 {/* Logo */}
//                 <div className="logo">Ecommerce</div>

//                 {/* Navigation Menu */}
//                 <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
//                     <Link to="/">Home</Link>
//                     <Link to="/shop">Shop</Link>
//                     <Link to="/about">About</Link>
//                     <Link to="/Contact">Contact</Link>
//                 </nav>

//                 {/* Right Section */}
//                 <div className="right-section">
//                     {/* Search Bar */}
//                     <div className="search-container">
//                         <FaSearch className="search-icon" />
//                         <input
//                             type="text"
//                             placeholder="Search products..."
//                             value={searchTerm}
//                             onChange={handleSearch}
//                         />
//                     </div>

//                     {user?.role === 'admin' && (
//                         <div className="admin-links">
//                             <Link to="/admin">Admin</Link>
//                         </div>
//                     )}

//                     {/* User Profile Section */}
//                     <div className="icons">
//                         {user ? (
//                             // If user is logged in, show profile icon & name
//                             <div className="profile-section">
//                                 <div className="profile-icon" onClick={toggleProfile}>
//                                     <FaUser className="icon" />
//                                     <span className="username">{user?.name}</span>
//                                 </div>

//                                 {/* Profile Dropdown Menu */}
//                                 {isProfileOpen && (
//                                     <div className="profile-dropdown">
//                                         <Link to="/profile">Profile</Link>
//                                         <button onClick={logout}>
//                                             <FaSignOutAlt /> Logout
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             // If user is not logged in, show login icon
//                             <Link to={'/login'}><FaUser className="icon" /></Link>
//                         )}

//                         {/* Cart Icon with Dynamic Count */}
//                         <div className="cart-icon relative">
//                             <Link to="/cart">
//                                 <FaShoppingCart className="icon" />
//                                 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
//                             </Link>
//                         </div>
//                     </div>

//                     {/* Mobile Menu Toggle */}
//                     <button className="menu-toggle" onClick={toggleMenu}>
//                         {isMenuOpen ? <FaTimes /> : <FaBars />}
//                     </button>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;


import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './index.css';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const profileRef = useRef(null);

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
        { name: 'Contact', path: '/contact' },
    ];

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
                                    Sign In
                                </Link>
                            )}
                        </div>

                        <Link to="/cart" className="icon-btn">
                            <FiShoppingCart />
                            {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        </Link>

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