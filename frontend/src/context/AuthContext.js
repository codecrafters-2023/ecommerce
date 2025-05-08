import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/auth/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            return null;
        }
    };


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkUserLoggedIn = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const userData = await fetchUserProfile(token);
            if (userData?._id) {
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const register = async (formData) => {
        try {
            // const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
            const res = await api.post(`/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            toast.success('Registration successful!');
            toast.success('Verification codes sent to your email');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (formData) => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/login`, 
                formData
            );
            
            localStorage.setItem('token', res.data.token);
            
            // Fetch complete user profile after login
            const userProfile = await fetchUserProfile(res.data.token);
            if (userProfile) {
                setUser(userProfile);
                toast.success('Login successful!');
                navigate('/');
            } else {
                throw new Error('Failed to fetch user profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            logout();
        }
    };

    const updateUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = await fetchUserProfile(token);
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed');
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, { password });
            toast.success('Password reset successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed');
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                forgotPassword,
                resetPassword,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);