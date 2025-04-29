import React, { useEffect, useState } from 'react';
import './home-products.css';
import { Link } from 'react-router-dom';

const HomeProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products/getLatestProducts`);
                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <section className="home-products">
            <div className="products-container">
                <div className="section-header">
                    <h2 className="section-title">Our Products</h2>
                    <button className="view-all-btn">
                        <Link to="/shop" className="view-all-link">Explore All Products</Link>
                    </button>
                </div>

                <div className="products-flex">
                    {products.map(product => (
                        <div key={product._id} className="product-card">
                            <Link to={`/productDetail/${product._id}`}>
                                <div className="product-image-container">
                                    {product.images[0] && (
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    )}
                                </div>
                            </Link>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="price-container">
                                    {product.discountPrice ? (
                                        <>
                                            <span className="original-price">
                                                ₹{product.price}
                                            </span>
                                            <span className="discount-price">
                                                ₹{product.discountPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="current-price">
                                            ₹{product.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeProducts;