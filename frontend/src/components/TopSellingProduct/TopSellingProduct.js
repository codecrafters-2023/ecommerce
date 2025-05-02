// components/TopSellingProduct.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TopSellingProduct.css'; // Assuming you have a CSS file for styling

const TopSellingProduct = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopProduct = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/top-selling`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTopProduct();
    }, []);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!product) return <div className="error-message">No 1kg product found</div>;

    return (
        <div className="top-selling-product">
            <div className="top-selling-section">
            <h2>Featured Product</h2>
            <div className="ts-product-container">
                <div className="ts-product-image">
                    <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                        }}
                    />
                </div>
                <div className="ts-product-info">
                    <h5 className='ts-product-brand'>{product.brand}</h5>
                    <h3>{product.name}</h3>
                    <div className="ts-price-section">
                        {product.discountPrice ? (
                            <>
                                <span className="ts-original-price">₹{product.price}</span>
                                <span className="ts-discounted-price">₹{product.discountPrice}</span>
                            </>
                        ) : (
                            <span className="ts-current-price">₹{product.price}</span>
                        )}
                    </div>
                    <p className="ts-product-weight">Weight: {product.weight}</p>
                    <p className="ts-product-description">{product.description}</p>
                    <Link to={`/productDetail/${product._id}`} className="ts-purchase-button">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
};

export default TopSellingProduct;