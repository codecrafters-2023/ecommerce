import React, { useState } from 'react';
import './index.css';
import { CiCreditCard1 } from "react-icons/ci";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { MdAddToPhotos } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { RiDiscountPercentFill, RiGalleryFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { FaCartArrowDown } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { MdDashboard } from "react-icons/md";

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { logout } = useAuth()

    const links = [
        { path: '/admin', name: 'Dashboard', icon: <MdDashboard /> },
        { path: '/admin-profile', name: 'Profile', icon: <ImProfile  /> },
        { path: '/allProducts', name: 'Products', icon: <HiMiniShoppingBag /> },
        { path: '/AddProduct', name: 'Add Products', icon: <MdAddToPhotos /> },
        { path: '/orders', name: 'Orders', icon: <FaCartArrowDown /> },
        { path: '/cancelorders', name: 'Cancelled Orders', icon: <MdCancel /> },
        { path: '/discounts', name: 'Discounts', icon: <RiDiscountPercentFill /> },
        { path: '/UsersList', name: 'Customers', icon: <FiUsers /> },
        { path: '/gallery-image-upload', name: 'Gallery', icon: <RiGalleryFill /> },
        // { path: '/', name: 'Billing', icon: <CiCreditCard1 /> },
        // { path: '/settings', name: 'Settings', icon: <FiSettings /> },
        { path: '/', name: 'User Panel', icon: <LuLayoutPanelLeft /> },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <motion.button
                className="mobile-toggle"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <FiX style={{ color: "#000", fontSize: "20px" }} /> : <FiMenu style={{ color: "#000", fontSize: "20px" }} />}
            </motion.button>

            {/* Backdrop Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={`modern-sidebar ${isOpen ? 'open' : ''}`}
                initial={{ x: '-100%' }}
                animate={{ x: isOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Logo Section */}
                <div className="sidebar-header">
                    <motion.div
                        className="logo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span>Admin</span>
                    </motion.div>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="nav-content"
                            >
                                <span className="nav-icon">{link.icon}</span>
                                <span className="nav-text">{link.name}</span>
                                <div className="active-indicator" />
                            </motion.div>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <motion.div
                    className="logout-section"
                    whileHover={{ scale: 1.02 }}
                    onClick={logout}
                >
                    <FiLogOut className="logout-icon" />
                    <span>Logout</span>
                </motion.div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
