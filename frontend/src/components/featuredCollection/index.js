// import React, { useEffect, useState } from 'react';
// import './home-products.css';
// import { Link } from 'react-router-dom';

// const HomeProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchLatestProducts = async () => {
//             try {
//                 const response = await fetch(`${process.env.REACT_APP_API_URL}/products/getLatestProducts`);
//                 const data = await response.json();
//                 if (data.success) {
//                     setProducts(data.products);
//                 }
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLatestProducts();
//     }, []);

//     if (loading) return <div>Loading...</div>;

//     return (
//         <section className="home-products">
//             <div className="products-container">
//                 <div className="section-header">
//                     <h2 className="section-title">Our Products</h2>
//                     <button className="view-all-btn">
//                         <Link to="/shop" className="view-all-link">Explore All Products</Link>
//                     </button>
//                 </div>

//                 <div className="products-flex">
//                     {products.map(product => (
//                         <div key={product._id} className="product-card">
//                             <Link to={`/productDetail/${product._id}`}>
//                                 <div className="product-image-container">
//                                     {product.images[0] && (
//                                         <img
//                                             src={product.images[0].url}
//                                             alt={product.name}
//                                             className="product-image"
//                                         />
//                                     )}
//                                 </div>
//                             </Link>
//                             <div className="product-info">
//                                 <h3 className="product-name">{product.name}</h3>
//                                 <div className="price-container">
//                                     {product.discountPrice ? (
//                                         <>
//                                             <span className="original-price">
//                                                 ₹{product.price}
//                                             </span>
//                                             <span className="discount-price">
//                                                 ₹{product.discountPrice}
//                                             </span>
//                                         </>
//                                     ) : (
//                                         <span className="current-price">
//                                             ₹{product.price}
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HomeProducts;


import React, { useEffect, useState } from 'react';
import './home-products.css';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, CheckCircle, Truck, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

    // Static featured products if API fails or for demo
    const featuredProducts = [
        {
            id: 1,
            name: 'Premium Turmeric Powder',
            image: `${process.env.PUBLIC_URL}/400_g.webp`,
            description: 'Rich aroma, natural flavor, responsibly sourced from organic farms in Tamil Nadu. A quality addition to your daily wellness and culinary excellence.',
            badge: 'Bestseller',
            badgeColor: '#F3D35C',
            features: ['Naturally Sourced', 'No Added Colors', 'FSSAI Certified'],
            price: '₹249',
            originalPrice: '₹299',
            startingText: 'Starting from',
            categoryName: 'turmeric powder'
        },
        {
            id: 2,
            name: 'Premium Jaggery Powder',
            image: `${process.env.PUBLIC_URL}/Jaggery_Powder_1.webp`,
            description: 'Natural sweetness, rich minerals, responsibly sourced by sugarcane farms. A wholesome alternative for your healthy lifestyle and traditional recipes.',
            badge: 'Popular',
            badgeColor: '#D4A75B',
            features: ['Naturally Sourced', 'No Additives', 'FSSAI Certified'],
            price: '₹199',
            originalPrice: '₹249',
            startingText: 'Starting from',
            categoryName: 'jaggery powder'
        },
        {
            id: 3,
            name: 'Jaggery Cubes (Gur)',
            image: `${process.env.PUBLIC_URL}/Jaggery_Powder_1.webp`,
            description: 'Authentic Punjabi gur in convenient cubes. Natural sweetness with traditional goodness, perfect for chai, sweets, and daily wellness rituals.',
            badge: 'Traditional',
            badgeColor: '#8CCB5E',
            features: ['Naturally Sourced', 'No Chemicals', 'FSSAI Certified'],
            price: '₹179',
            originalPrice: '₹219',
            startingText: 'Starting from',
            categoryName: 'jaggery cubes'
        }
    ];

    if (loading && products.length === 0) {
        return (
            <section className="featured-categories-modern" id="explore-section">
                <div className="featured-container">
                    <div className="section-header">
                        <div className="section-badge">
                            <Sparkles className="badge-icon" />
                            <span>Handpicked with Care</span>
                        </div>
                        <h2 className="featured-section-title">Our Natural Essentials</h2>
                        <p className="section-description">
                            Three pure products, cultivated with care from India's finest organic farms.
                            Experience authentic flavor and unmatched quality in every spoonful.
                        </p>
                    </div>
                    <div className="loading-container">Loading...</div>
                </div>
            </section>
        );
    }

    // Use API products if available, otherwise use featured products
    const displayProducts = products.length > 0 ?
        products.slice(0, 3).map(product => ({
            id: product._id,
            name: product.name,
            image: product.images?.[0]?.url || `${process.env.PUBLIC_URL}/400_g.webp`,
            description: product.description || 'Premium quality product with natural ingredients.',
            // badge: product.category === 'turmeric' ? 'Bestseller' :
            //     product.category === 'jaggery' ? 'Popular' : 'Traditional',
            badgeColor: product.category === 'turmeric' ? '#F3D35C' :
                product.category === 'jaggery' ? '#D4A75B' : '#8CCB5E',
            features: ['Naturally Sourced', 'No Additives', 'FSSAI Certified'],
            price: `₹${product.discountPrice || product.price}`,
            originalPrice: product.discountPrice ? `₹${product.price}` : null,
            startingText: 'Starting from',
            categoryName: product.category || 'product'
        })) :
        featuredProducts;

    return (
        <section className="featured-categories-modern" id="explore-section">
            <div className="featured-container">
                {/* Section Header */}
                <div className="section-header">
                    <div className="section-badge">
                        <Sparkles className="badge-icon" />
                        <span>Handpicked with Care</span>
                    </div>
                    <h2 className="featured-section-title">Our Natural Essentials</h2>
                    <p className="section-description">
                        Premium products, cultivated with care from India's finest organic farms.
                        Experience authentic flavor and unmatched quality in every spoonful.
                    </p>
                </div>

                {/* Three-Product Grid */}
                <div className="products-grid">
                    {displayProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="product-card-group"
                        >
                            <div className="product-card">
                                {/* Premium Badge */}
                                {/* <div className="product-badge" style={{ backgroundColor: product.badgeColor }}>
                                    <span>{product.badge}</span>
                                </div> */}

                                {/* Product Image Container */}
                                <div className="product-image-container">
                                    <Link to={`/productDetail/${product.id}`}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.4 }}
                                            className="product-image-wrapper"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-image"
                                                loading="lazy"
                                            />
                                        </motion.div>
                                    </Link>
                                </div>

                                {/* Product Details */}
                                <div className="product-details">
                                    {/* Product Name */}
                                    <div className="product-name-section">
                                        <Link to={`/productDetail/${product.id}`}>
                                            <h3 className="product-name">{product.name}</h3>
                                        </Link>
                                        <div className="product-certification">
                                            <Award className="certification-icon" />
                                            <span className="certification-text">Lab Tested & Certified</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {/* <p className="product-description">{product.description}</p> */}

                                    {/* Features */}
                                    {/* <div className="product-features">
                                        {product.features.map((feature, idx) => (
                                            <div key={idx} className="feature-tag">
                                                <CheckCircle className="feature-icon" />
                                                <span className="feature-text">{feature}</span>
                                            </div>
                                        ))}
                                    </div> */}

                                    {/* Price & CTA */}
                                    <div className="product-footer">
                                        <div className="price-section">
                                            <p className="starting-text">{product.startingText}</p>
                                            <div className="price-container">
                                                <p className="product-price">{product.price}</p>
                                                {product.originalPrice && (
                                                    <p className="original-price">{product.originalPrice}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/productDetail/${product.id}`}
                                            className="shop-now-button"
                                        >
                                            <span>Shop Now</span>
                                            <ArrowRight className="shop-arrow" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Products Button */}
                {/* <div className="view-all-container">
                    <Link to="/shop" className="view-all-button">
                        <span>View All Products</span>
                        <ArrowRight className="view-all-arrow" />
                    </Link>
                </div> */}

                {/* Bottom Trust Bar */}
                <div className="trust-bar">
                    <div className="trust-item">
                        <div className="home-trust-icon-wrapper">
                            <Truck className="home-trust-icon" />
                        </div>
                        <div className="trust-text">
                            <p className="home-trust-title">Free Delivery*</p>
                            <p className="trust-subtitle">On orders above ₹499</p>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="home-trust-icon-wrapper">
                            <Award className="home-trust-icon" />
                        </div>
                        <div className="trust-text">
                            <p className="home-trust-title">Lab Tested</p>
                            <p className="trust-subtitle">Quality checked every batch</p>
                        </div>
                    </div>
                    <div className="trust-item">
                        <div className="home-trust-icon-wrapper">
                            <Leaf className="home-trust-icon" />
                        </div>
                        <div className="trust-text">
                            <p className="home-trust-title">Naturally Sourced</p>
                            <p className="trust-subtitle">From trusted organic farms</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeProducts;