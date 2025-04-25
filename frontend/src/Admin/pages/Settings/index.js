import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';
import './AdminStyles.css';
import AdminSidebar from '../../components/Navbar';

const Settings = () => {
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountAmount: 0,
        minOrderAmount: 0,
        maxDiscount: null,
        validFrom: '',
        validUntil: '',
        maxUses: null,
        active: true
    });
    const [editMode, setEditMode] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/coupons`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Always get from localStorage

            if (!token) {
                alert('Authentication required');
                return;
            }

            if (editMode) {
                await axios.put(`${process.env.REACT_APP_API_URL}/coupons/${currentCouponId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Add new coupon
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/coupons`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 201) {
                    alert('Coupon created successfully!');
                }
            }

            fetchCoupons();
            resetForm();
        } catch (error) {
            console.error('Error saving coupon:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleEdit = (coupon) => {
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount,
            minOrderAmount: coupon.minOrderAmount || 0,
            maxDiscount: coupon.maxDiscount || null,
            validFrom: coupon.validFrom ? format(new Date(coupon.validFrom), "yyyy-MM-dd'T'HH:mm") : '',
            validUntil: coupon.validUntil ? format(new Date(coupon.validUntil), "yyyy-MM-dd'T'HH:mm") : '',
            maxUses: coupon.maxUses || null,
            active: coupon.active
        });
        setEditMode(true);
        setCurrentCouponId(coupon._id);
    };

    const handleDelete = async (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/coupons/${couponId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountAmount: 0,
            minOrderAmount: 0,
            maxDiscount: null,
            validFrom: '',
            validUntil: '',
            maxUses: null,
            active: true
        });
        setEditMode(false);
        setCurrentCouponId(null);
    };

    return (
        <>
            <AdminSidebar />
            <div className="admin-container">
                <h2>{editMode ? 'Edit Coupon' : 'Create New Coupon'}</h2>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Coupon Code:</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Discount Type:</label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            {formData.discountType === 'percentage' ? 'Discount Percentage:' : 'Discount Amount:'}
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.discountAmount}
                            onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                            required
                        />
                    </div>

                    {formData.discountType === 'percentage' && (
                        <div className="form-group">
                            <label>Maximum Discount:</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.maxDiscount || ''}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value || null })}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Minimum Order Amount:</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.minOrderAmount}
                            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Valid From:</label>
                        <input
                            type="datetime-local"
                            value={formData.validFrom}
                            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Valid Until:</label>
                        <input
                            type="datetime-local"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Uses:</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.maxUses || ''}
                            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value || null })}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            Active
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="btn-primary">
                            {editMode ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>

                <h3>Existing Coupons</h3>
                <div className="admin-list">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="admin-list-item">
                            <div className="item-info">
                                <strong>{coupon.code}</strong>
                                <span>{coupon.discountType === 'percentage'
                                    ? `${coupon.discountAmount}%`
                                    : `₹${coupon.discountAmount}`}</span>
                                <span>Uses: {coupon.usedCount}/{coupon.maxUses || '∞'}</span>
                                <span>Status: {coupon.active ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => handleEdit(coupon)} className="btn-edit">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(coupon._id)} className="btn-delete">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Settings;