import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Navbar';
import { getAdminProfile, updateUser } from '../../../context/userContext';
import './AdminProfile.css';

const AdminProfile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        role: '',
        phone: ''
    });
    // const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adminData, adminList] = await Promise.all([
                    getAdminProfile(),
                    // getAdminList()
                ]);
                setUserData(adminData);
                // setAdmins(adminList);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const adminData = await getAdminProfile();
                setUserData(adminData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load admin profile');
                setLoading(false);
            }
        };
        fetchAdminProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            await updateUser(userData._id, userData);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        }
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-profile-container">
            <AdminSidebar />
            <main className="admin-profile-main">
                <div className="admin-profile-card">
                    <div className="admin-profile-header">
                        <div className="admin-profile-avatar">
                            {userData.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="admin-profile-title">Admin Profile</h1>
                    </div>

                    <form className="admin-profile-form" onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Full Name</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                name="fullName"
                                value={userData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Email</label>
                            <input
                                type="email"
                                className="admin-form-input"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Phone</label>
                            <input
                                type="tel"
                                className="admin-form-input"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Role</label>
                            <select
                                className="admin-form-input admin-form-select"
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        <div className="admin-profile-actions">
                            <button type="submit" className="admin-update-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293a1 1 0 00-1.414 0z" />
                                </svg>
                                Update Profile
                            </button>
                        </div>

                        {success && (
                            <div className="admin-status-message admin-success-message">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="admin-status-message admin-error-message">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminProfile;