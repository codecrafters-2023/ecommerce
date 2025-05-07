import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/Navbar';
import { getAdminProfile, updateUser } from '../../../context/userContext';
import './Settings.css';

const Settings = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        role: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

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
        <div className="settings-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar">
                            {userData.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h1>Admin Profile</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                name="fullName"
                                value={userData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                className="form-input"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-input"
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                            >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>

                        <button type="submit" className="update-btn">
                            Update Profile
                        </button>

                        {success && <div className="success-message">{success}</div>}
                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Settings;