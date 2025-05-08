import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiTruck, } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import Header from '../../components/header';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Footer/Footer';
import HomeProducts from '../../components/featuredCollection';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart, clearCart } = useCart();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const imageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
    };

    const tabContentVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="loading-spinner-container"
            >
                <div className="loading-spinner"></div>
            </motion.div>
        );
    }

    if (!product) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-message"
            >
                Product not found
            </motion.div>
        );
    }

    return (
        <>
            <Header />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="product-detail-container"
            >
                {/* Image Gallery */}
                <div className="product-gallery">
                    <motion.div
                        className="main-image"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <motion.img
                            key={selectedImage}
                            src={product.images[selectedImage].url}
                            alt={product.name}
                            initial="hidden"
                            animate="visible"
                            variants={imageVariants}
                        />
                    </motion.div>

                    <div className="thumbnail-grid">
                        {product.images.map((image, index) => (
                            <motion.img
                                key={index}
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className={index === selectedImage ? 'active' : ''}
                                onClick={() => setSelectedImage(index)}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
                        <p className="product-brand">{product.brand}</p>
                        <h1 className="product___title">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={i < product.rating ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                            <span>({product.reviewCount} reviews)</span>
                        </div>

                        <div className="price-section">
                            <div className="price-container">
                                <span className="current-price">
                                    ₹{product.discountPrice}
                                </span>
                                {product.price && (
                                    <span className="original-price">
                                        ₹{product.price}
                                    </span>
                                )}

                                {product.discountPrice < product.price && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="discount-badge"
                                    >
                                        {Math.round(
                                            ((product.price - product.discountPrice) /
                                                product.price) *
                                            100
                                        )}
                                        % OFF
                                    </motion.span>
                                )}
                                {product.quantity === 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="sold-out-badge"
                                    >
                                        Sold Out
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="delivery-info">
                            <FiTruck />
                            <span>Free Shipping on orders above ₹499</span>
                        </div>

                        <div className="quantity-selector">
                            <h3>Quantity:</h3>
                            <motion.div className="quantity-control">
                                <motion.button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    -
                                </motion.button>
                                <motion.span
                                    key={quantity}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    {quantity}
                                </motion.span>
                                <motion.button
                                    onClick={() => setQuantity(quantity + 1)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    +
                                </motion.button>
                            </motion.div>
                        </div>

                        <div className="action-buttons">
                            <motion.button
                                className="add-to-cart"
                                onClick={() => addToCart(product._id, quantity)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={product.quantity === 0}
                            >
                                <FiShoppingCart />
                                Add to Cart
                                {/* {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'} */}
                            </motion.button>

                            <motion.button
                                className="buy-now"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={product.quantity === 0}
                                onClick={async () => {
                                    if (product.quantity > 0) {
                                        // Existing buy now logic
                                    }
                                }}
                            >
                                Buy Now
                                {/* {product.quantity === 0 ? 'Out of Stock' : 'Buy Now'} */}
                            </motion.button>
                        </div>

                    </motion.div>

                    {/* Product Tabs */}
                    <div className="product-tabs">
                        {['description', 'specs', 'reviews'].map((tab) => (
                            <motion.button
                                key={tab}
                                className={activeTab === tab ? 'active' : ''}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ y: -2 }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div
                                        className="underline"
                                        layoutId="underline"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="tab-content"
                        >
                            {activeTab === 'description' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="domain-description"
                                >
                                    <div className="formatted-content">
                                        {product.description}
                                    </div>
                                </motion.div>
                            )}


                            {activeTab === 'specs' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="domain-description"
                                >
                                    <div className="formatted-content">
                                        {product.specification}
                                    </div>
                                </motion.div>
                            )}

                            {/* {activeTab === 'reviews' && (
                                <div className="reviews-container">
                                    {product.reviews.map((review) => (
                                        <motion.div
                                            key={review._id}
                                            className="review-card"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="review-header">
                                                <span className="review-author">
                                                    {review.user.name}
                                                </span>
                                                <div className="review-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={i < review.rating ? 'filled' : ''}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="review-text">{review.comment}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )} */}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
            <HomeProducts />
            <Footer />
        </>
    );
};

export default ProductDetail;