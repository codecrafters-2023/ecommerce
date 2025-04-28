import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './Discounts.css';
import AdminSidebar from '../../components/Navbar';

const Discounts = () => {
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
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchCoupons() }, []);

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
            const token = localStorage.getItem('token');
            if (!token) return alert('Authentication required');

            const url = editMode
                ? `${process.env.REACT_APP_API_URL}/coupons/${currentCouponId}`
                : `${process.env.REACT_APP_API_URL}/coupons`;

            await axios[editMode ? 'put' : 'post'](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchCoupons();
            resetForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (coupon) => {
        setFormData({
            ...coupon,
            validFrom: formatDate(coupon.validFrom),
            validUntil: formatDate(coupon.validUntil)
        });
        setEditMode(true);
        setCurrentCouponId(coupon._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/coupons/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchCoupons();
        } catch (error) {
            console.error('Delete error:', error);
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
        setShowForm(false);
    };

    const formatDate = (date) =>
        date ? format(new Date(date), "yyyy-MM-dd'T'HH:mm") : '';

    return (
        <>
            <AdminSidebar />
            <div className="discount-container">
                <div className="header">
                    <h1 className="header-title">Discount Coupon</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + New Coupon
                    </button>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editMode ? 'Edit Coupon' : 'Create Coupon'}
                                </h2>
                                <button className="btn btn-secondary" onClick={resetForm}>
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Coupon Code</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Discount Type</label>
                                        <select
                                            className="form-input"
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            {formData.discountType === 'percentage' ? 'Discount %' : 'Amount'}
                                        </label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            min="0"
                                            value={formData.discountAmount}
                                            onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {formData.discountType === 'percentage' && (
                                        <div className="form-group">
                                            <label className="form-label">Max Discount</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                min="0"
                                                value={formData.maxDiscount || ''}
                                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value || null })}
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Min Order</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            min="0"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Valid From</label>
                                        <input
                                            type="datetime-local"
                                            className="form-input"
                                            value={formData.validFrom}
                                            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Valid Until</label>
                                        <input
                                            type="datetime-local"
                                            className="form-input"
                                            value={formData.validUntil}
                                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Max Uses</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            min="0"
                                            value={formData.maxUses || ''}
                                            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value || null })}
                                        />
                                    </div>
                                </div>

                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    <label className="checkbox-label" htmlFor="active">Active</label>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editMode ? 'Save Changes' : 'Create Coupon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="coupons-grid">
                    {coupons.map(coupon => (
                        <div key={coupon._id} className="coupon-card">
                            <div className="card-header">
                                <h3 className="card-title">{coupon.code}</h3>
                                <span className={`status_badge ${coupon.active ? 'status_active' : 'status_inactive'}`}>
                                    {coupon.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="card-content">
                                <div className="card-detail">
                                    <span className="detail-label">Discount</span>
                                    <span className="detail-value">
                                        {coupon.discountType === 'percentage'
                                            ? `${coupon.discountAmount}%`
                                            : `$${coupon.discountAmount}`}
                                    </span>
                                </div>

                                <div className="card-detail">
                                    <span className="detail-label">Min Order</span>
                                    <span className="detail-value">₹{coupon.minOrderAmount}</span>
                                </div>

                                <div className="card-detail">
                                    <span className="detail-label">Uses</span>
                                    <span className="detail-value">
                                        {coupon.usedCount}/{coupon.maxUses || '∞'}
                                    </span>
                                </div>

                                <div className="card-detail">
                                    <span className="detail-label">Valid Until</span>
                                    <span className="detail-value">
                                        {format(new Date(coupon.validUntil), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="btn btn-primary !px-3 !py-2"
                                    onClick={() => handleEdit(coupon)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-secondary !px-3 !py-2"
                                    onClick={() => handleDelete(coupon._id)}
                                >
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

export default Discounts;