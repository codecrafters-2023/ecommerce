import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);




    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkUserLoggedIn = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Verify token with backend
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data._id) {
                setUser(response.data);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    const register = async (formData) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            toast.success('Registration successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (formData) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data);

            toast.success('Login successful!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
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
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);