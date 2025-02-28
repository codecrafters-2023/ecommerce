import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { FaCube, FaGlobe } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { IoIosLogOut } from "react-icons/io";
import { CiCreditCard1 } from "react-icons/ci";





const AdminSidebar = () => {

    const { logout } = useAuth();

    return (
        <>
            <div class="admin-container">
                {/* <!-- Sidebar --> */}
                <div>
                    <aside class="sidebar">
                        <div class="logo-container">
                            <div class="admin_logo">
                                <FaCube className='logo_icon' />
                                <span>Admin</span>
                            </div>
                        </div>

                        <nav>
                            <ul class="nav-menu">
                                <li class="nav-item active">
                                    <Link to={'/admin'} class="nav-link">
                                        <MdDashboard className='sidebar_icons' />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'/allProducts'} class="nav-link">
                                        <FaGlobe className='sidebar_icons' />
                                        <span>Products</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'/AddProduct'} class="nav-link">
                                        <FaGlobe className='sidebar_icons' />
                                        <span>Add Products</span>
                                    </Link>
                                </li>
                                
                                <li class="nav-item">
                                    <Link to={'#'} class="nav-link">
                                        <CiCreditCard1 className='sidebar_icons' />
                                        <span>Billing</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'/UsersList'} class="nav-link">
                                        <CiCreditCard1 className='sidebar_icons' />
                                        <span>Users List</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'#'} class="nav-link">
                                        <IoIosSettings className='sidebar_icons' />
                                        <span>Settings</span>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <button className='logout_btn' onClick={logout}>Logout<IoIosLogOut /></button>
                    </aside>

                </div>


            </div>
        </>
    );
};

export default AdminSidebar;
