import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { FaCube } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { IoServer } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { IoIosLogOut } from "react-icons/io";

const AdminSidebar = () => {

    const { logout } = useAuth();

    return (
        <>
            <div class="admin-container">
                {/* <!-- Sidebar --> */}
                <div>
                    <aside class="sidebar">
                        <div class="logo-container">
                            <div class="logo">
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
                                    <Link to={'/domains'} class="nav-link">
                                        <FaGlobe className='sidebar_icons' />
                                        <span>Domains</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'#'} class="nav-link">
                                        <IoServer className='sidebar_icons' />
                                        <span>Hosting</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to={'#'} class="nav-link">
                                        <FaUsers className='sidebar_icons' />
                                        <span>Users</span>
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