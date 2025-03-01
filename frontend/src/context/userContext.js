// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/userlist`,
    headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
    },
});

// Users API
export const getUsers = async (page, limit) => {
    try {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    } catch (err) {
        throw err.response.data;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (err) {
        throw err.response.data;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (err) {
        throw err.response.data;
    }
};