import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiTruck } from 'react-icons/fi';
import './index.css';
import Header from '../../components/header';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const { addToCart } = useCart();


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/products/${id}`);
                setProduct(response.data);
                // setSelectedVariant(response.data.variants[0]);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (!product) {
        return <div className="error-message">Product not found</div>;
    }

    return (
        <>
            <Header />

            <div className="product-detail-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img
                            src={product.images[selectedImage].url}
                            alt={product.name}
                        />
                    </div>
                    <div className="thumbnail-grid">
                        {product?.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className={index === selectedImage ? 'active' : ''}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <p className='product-brand'>{product.brand}</p>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className={i < product.rating ? 'filled' : ''} />
                            ))}
                        </div>
                        <span>({product.reviewCount} reviews)</span>
                    </div>

                    <div className="price-section">
                        {/* {product.discountPrice > 0 && (
                            <span className="discount-badge">₹ {product.discountPrice}</span>
                        )} */}
                        <span className="current-price">₹{product.discountPrice}</span>
                        {product.price && (
                            <span className="original-price">₹{product.price}</span>
                        )}
                    </div>


                    <div className="quantity-selector">
                        <h3>Quantity:</h3>
                        <div className="quantity-control">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="add-to-cart"
                            onClick={() => addToCart(product._id)}
                        >
                            <FiShoppingCart /> Add to Cart
                        </button>
                        <button className="buy-now">Buy Now</button>
                        <button className="wishlist">
                            <FiHeart /> Wishlist
                        </button>
                    </div>

                    {/* <div className="delivery-info">
                        <FiTruck />
                        <span>Free delivery on orders over $50</span>
                    </div> */}

                    {/* Product Tabs */}
                    <div className="product-tabs">
                        <button
                            className={activeTab === 'description' ? 'active' : ''}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={activeTab === 'specs' ? 'active' : ''}
                            onClick={() => setActiveTab('specs')}
                        >
                            Specifications
                        </button>
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviewCount})
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="domain-description">
                                <div className="formatted-content">
                                    {product.description}
                                </div>
                            </div>
                            // <p className="product-description">{product.description}</p>
                        )}

                        {activeTab === 'specs' && (
                            <div className="domain-description">
                                <div className="formatted-content">
                                    {product.specification}
                                </div>
                            </div>
                            // <p className="product-description">{product.specification}</p>
                        )}

                        {/* {activeTab === 'specs' && (
                        <div className="specifications">
                            {product.specs.map((spec, index) => (
                                <div key={index} className="spec-item">
                                    <span className="spec-name">{spec.name}:</span>
                                    <span className="spec-value">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    )} */}
                    </div>
                </div>

                {/* Related Products Section */}
                {/* <section className="related-products">
                <h2>You Might Also Like</h2>
                <div className="related-grid">
                    {product.relatedItems.map(item => (
                        <div key={item.id} className="related-product">
                            <img src={item.image} alt={item.name} />
                            <h4>{item.name}</h4>
                            <p>${item.price}</p>
                        </div>
                    ))}
                </div>
            </section> */}
            </div>
        </>
    );
};

export default ProductDetail;