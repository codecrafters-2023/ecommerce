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


import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './index.css';

const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback]);
};

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const profileRef = useRef(null);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };


    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const menuVariants = {
        open: {
            opacity: 1,
            x: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
        closed: {
            opacity: 0,
            x: '100%',
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        },
    };

    const itemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: 20 },
    };

    // Use click outside hook for profile dropdown
    useClickOutside(profileRef, () => {
        setIsProfileOpen(false);
    });
    return (
        <>
            {/* Removed initial animation from navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo Section */}
                    <motion.div
                        className="logo"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <Link to="/" className="logo-link">
                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
                            {/* <GiClothes className="logo-icon" />
                            <span className="logo-text">AVANTI</span> */}
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="nav-links">
                        {navItems.map((item) => (
                            <motion.div
                                key={item.name}
                                whileHover={{
                                    scale: 1.05,
                                    color: '#FF4D4D'
                                }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Link
                                    to={item.path}
                                    className="nav-item"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                    <div className="underline" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div className="action-section">
                        <motion.button
                            className="icon-btn"
                            onClick={() => setSearchOpen(!searchOpen)}
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiSearch />
                        </motion.button>

                        <motion.button
                            className="icon-btn"
                            whileHover={{ scale: 1.1 }}
                        >
                            {user ? (
                                // If user is logged in, show profile icon & name
                                <div className="profile-section" ref={profileRef}>
                                    <div className="profile-icon" onClick={toggleProfile}>
                                        <FaUser className="profile-icon" />
                                        {/* <span className="username">{user?.name}</span> */}
                                    </div>

                                    {/* Profile Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="profile-dropdown">
                                            <button className='profile'>
                                                <FaUser  className='logout-icon'/>
                                                <Link to="/profile" className='profile-name profile'>Profile</Link>
                                            </button>
                                            <button onClick={logout} className='profile'>
                                                <FaSignOutAlt className='logout-icon' /> Logout
                                            </button>
                                            {user.role === 'admin' && (
                                                <button className='profile'>
                                                    <RiAdminFill  className='logout-icon'/>
                                                    <Link to="/admin" className=' profile'>Admin</Link>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // If user is not logged in, show login icon
                                // <Link to={'/login'}><FaUser className="icon" /></Link>
                                <Link to={'/login'}>Sign In</Link>
                            )}
                        </motion.button>

                        <Link to="/cart" className="icon-btn">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                            >
                                <FiShoppingCart />
                                {cartCount > 0 &&
                                    <motion.span className="badge">{cartCount}</motion.span>}
                            </motion.button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            className="menu-toggle"
                            onClick={() => setIsOpen(!isOpen)}
                            whileHover={{ rotate: 90 }}
                        >
                            {isOpen ? <FiX /> : <FiMenu />}
                        </motion.button>
                    </div>

                    {/* Search Bar */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                className="navbar-search-container"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 300 }}
                                exit={{ opacity: 0, width: 0 }}
                            >
                                <input type="text" placeholder="Search..." />
                                <button
                                    className="close-search"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    &times;
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="mobile-menu"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                        >
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Link
                                        to={item.path}
                                        className="mobile-item"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Content wrapper to prevent overlap */}
            <div className="content-wrapper">
                {/* Your page content here */}
            </div>
        </>
    );
};

export default Header;