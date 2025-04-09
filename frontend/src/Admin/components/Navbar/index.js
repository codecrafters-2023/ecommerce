// import React from 'react';
// import { Link } from 'react-router-dom';
// import './index.css';
import { FaCube } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

// import { useAuth } from '../../../context/AuthContext';
import { IoIosLogOut } from "react-icons/io";
import { CiCreditCard1 } from "react-icons/ci";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { MdAddToPhotos } from "react-icons/md";
import { FaUsers } from "react-icons/fa";


// const AdminSidebar = () => {

//     const { logout } = useAuth();

//     return (
//         <>
//             <div class="admin-container">
//                 {/* <!-- Sidebar --> */}
//                 <div>
//                     <aside class="sidebar">
//                         <div class="logo-container">
//                             <div class="admin_logo">
//                                 <FaCube className='logo_icon' />
//                                 <span>Admin</span>
//                             </div>
//                         </div>

//                         <nav>
//                             <ul class="nav-menu">
//                                 <li class="nav-item active">
//                                     <Link to={'/admin'} class="nav-link">
//                                         <MdDashboard className='sidebar_icons' />
//                                         <span>Dashboard</span>
//                                     </Link>
//                                 </li>
//                                 <li class="nav-item">
//                                     <Link to={'/allProducts'} class="nav-link">
//                                         <HiMiniShoppingBag className='sidebar_icons' />
//                                         <span>Products</span>
//                                     </Link>
//                                 </li>
//                                 <li class="nav-item">
//                                     <Link to={'/AddProduct'} class="nav-link">
//                                         <MdAddToPhotos className='sidebar_icons' />
//                                         <span>Add Products</span>
//                                     </Link>
//                                 </li>
                                
//                                 <li class="nav-item">
//                                     <Link to={'#'} class="nav-link">
//                                         <CiCreditCard1 className='sidebar_icons' />
//                                         <span>Billing</span>
//                                     </Link>
//                                 </li>
                                
//                                 <li class="nav-item">
//                                     <Link to={'/orders'} class="nav-link">
//                                         <CiCreditCard1 className='sidebar_icons' />
//                                         <span>Orders</span>
//                                     </Link>
//                                 </li>
                                
//                                 <li class="nav-item">
//                                     <Link to={'/UsersList'} class="nav-link">
//                                         <FaUsers className='sidebar_icons' />
//                                         <span>Users List</span>
//                                     </Link>
//                                 </li>
//                                 <li class="nav-item">
//                                     <Link to={'#'} class="nav-link">
//                                         <IoIosSettings className='sidebar_icons' />
//                                         <span>Settings</span>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </nav>
//                         <button className='logout_btn' onClick={logout}>Logout<IoIosLogOut /></button>
//                     </aside>

//                 </div>


//             </div>
//         </>
//     );
// };

// export default AdminSidebar;

// ModernSidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiGlobe, FiPlus, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { LuLayoutPanelLeft } from "react-icons/lu";
import { motion, AnimatePresence } from 'framer-motion';
import './index.css'
import { useAuth } from '../../../context/AuthContext';
import { MdDashboard } from "react-icons/md";

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { logout } = useAuth()

    const links = [
        { path: '/admin', name: 'Dashboard', icon: <MdDashboard /> },
        { path: '/allProducts', name: 'Products', icon: <HiMiniShoppingBag /> },
        { path: '/AddProduct', name: 'Add Products', icon: <MdAddToPhotos /> },
        { path: '/orders', name: 'Orders', icon: <MdAddToPhotos /> },
        { path: '/', name: 'Billing', icon: <CiCreditCard1 /> },
        { path: '/UsersList', name: 'Users', icon: <FiUsers /> },
        { path: '/settings', name: 'Settings', icon: <FiSettings /> },
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
                {isOpen ? <FiX style={{color:"#000", fontSize:"20px"}}/> : <FiMenu style={{color:"#000", fontSize:"20px"}} />}
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
                    <FiLogOut className="logout-icon"/>
                    <span>Logout</span>
                </motion.div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
