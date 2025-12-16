// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FiStar, FiShoppingCart, FiTruck, } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import './index.css';
// import Header from '../../components/header';
// import { useCart } from '../../context/CartContext';
// import Footer from '../../components/Footer/Footer';
// import HomeProducts from '../../components/featuredCollection';

// const ProductDetail = () => {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('description');
//     const { addToCart, clearCart } = useCart();

//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/products/${id}`);
//                 setProduct(data);
//             } catch (error) {
//                 console.error('Error fetching product:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [id]);

//     const imageVariants = {
//         hidden: { opacity: 0 },
//         visible: { opacity: 1, transition: { duration: 0.3 } }
//     };

//     const tabContentVariants = {
//         hidden: { y: 20, opacity: 0 },
//         visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
//     };

//     if (loading) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="loading-spinner-container"
//             >
//                 <div className="loading-spinner"></div>
//             </motion.div>
//         );
//     }

//     if (!product) {
//         return (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="error-message"
//             >
//                 Product not found
//             </motion.div>
//         );
//     }

//     return (
//         <>
//             <Header />
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="product-detail-container"
//             >
//                 {/* Image Gallery */}
//                 <div className="product-gallery">
//                     <motion.div
//                         className="main-image"
//                         whileHover={{ scale: 1.02 }}
//                         transition={{ type: 'spring', stiffness: 300 }}
//                     >
//                         <motion.img
//                             key={selectedImage}
//                             src={product.images[selectedImage].url}
//                             alt={product.name}
//                             initial="hidden"
//                             animate="visible"
//                             variants={imageVariants}
//                         />
//                     </motion.div>

//                     <div className="thumbnail-grid">
//                         {product.images.map((image, index) => (
//                             <motion.img
//                                 key={index}
//                                 src={image.url}
//                                 alt={`Thumbnail ${index + 1}`}
//                                 className={index === selectedImage ? 'active' : ''}
//                                 onClick={() => setSelectedImage(index)}
//                                 whileHover={{ scale: 1.05 }}
//                                 transition={{ type: 'spring', stiffness: 300 }}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Product Info */}
//                 <div className="product-info">
//                     <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
//                         <p className="product-brand">{product.brand}</p>
//                         <h1 className="product___title">{product.name}</h1>

//                         <div className="product-rating">
//                             <div className="stars">
//                                 {[...Array(5)].map((_, i) => (
//                                     <FiStar
//                                         key={i}
//                                         className={i < product.rating ? 'filled' : ''}
//                                     />
//                                 ))}
//                             </div>
//                             <span>({product.reviewCount} reviews)</span>
//                         </div>

//                         <div className="price-section">
//                             <div className="price-container">
//                                 <span className="current-price">
//                                     ₹{product.discountPrice}
//                                 </span>
//                                 {product.price && (
//                                     <span className="original-price">
//                                         ₹{product.price}
//                                     </span>
//                                 )}

//                                 {product.discountPrice < product.price && (
//                                     <motion.span
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         className="discount-badge"
//                                     >
//                                         {Math.round(
//                                             ((product.price - product.discountPrice) /
//                                                 product.price) *
//                                             100
//                                         )}
//                                         % OFF
//                                     </motion.span>
//                                 )}
//                                 {product.quantity === 0 && (
//                                     <motion.div
//                                         initial={{ scale: 0 }}
//                                         animate={{ scale: 1 }}
//                                         className="sold-out-badge"
//                                     >
//                                         Sold Out
//                                     </motion.div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="delivery-info">
//                             <FiTruck />
//                             <span>Free Shipping on orders above ₹499</span>
//                         </div>

//                         <div className="quantity-selector">
//                             <h3>Quantity:</h3>
//                             <motion.div className="quantity-control">
//                                 <motion.button
//                                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     -
//                                 </motion.button>
//                                 <motion.span
//                                     key={quantity}
//                                     initial={{ scale: 0 }}
//                                     animate={{ scale: 1 }}
//                                 >
//                                     {quantity}
//                                 </motion.span>
//                                 <motion.button
//                                     onClick={() => setQuantity(quantity + 1)}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     +
//                                 </motion.button>
//                             </motion.div>
//                         </div>

//                         <div className="action-buttons">
//                             <motion.button
//                                 className="add-to-cart"
//                                 onClick={() => addToCart(product._id, quantity)}
//                                 whileHover={{ y: -2 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 disabled={product.quantity === 0}
//                             >
//                                 <FiShoppingCart />
//                                 Add to Cart
//                                 {/* {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'} */}
//                             </motion.button>

//                             <motion.button
//                                 className="buy-now"
//                                 whileHover={{ y: -2 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 disabled={product.quantity === 0}
//                                 onClick={async () => {
//                                     if (product.quantity > 0) {
//                                         // Existing buy now logic
//                                     }
//                                 }}
//                             >
//                                 Buy Now
//                                 {/* {product.quantity === 0 ? 'Out of Stock' : 'Buy Now'} */}
//                             </motion.button>
//                         </div>

//                     </motion.div>

//                     {/* Product Tabs */}
//                     <div className="product-tabs">
//                         {['description', 'specs', 'reviews'].map((tab) => (
//                             <motion.button
//                                 key={tab}
//                                 className={activeTab === tab ? 'active' : ''}
//                                 onClick={() => setActiveTab(tab)}
//                                 whileHover={{ y: -2 }}
//                             >
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                 {activeTab === tab && (
//                                     <motion.div
//                                         className="underline"
//                                         layoutId="underline"
//                                     />
//                                 )}
//                             </motion.button>
//                         ))}
//                     </div>

//                     <AnimatePresence mode='wait'>
//                         <motion.div
//                             key={activeTab}
//                             variants={tabContentVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="hidden"
//                             className="tab-content"
//                         >
//                             {activeTab === 'description' && (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="domain-description"
//                                 >
//                                     <div className="formatted-content">
//                                         {product.description}
//                                     </div>
//                                 </motion.div>
//                             )}


//                             {activeTab === 'specs' && (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     className="domain-description"
//                                 >
//                                     <div className="formatted-content">
//                                         {product.specification}
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* {activeTab === 'reviews' && (
//                                 <div className="reviews-container">
//                                     {product.reviews.map((review) => (
//                                         <motion.div
//                                             key={review._id}
//                                             className="review-card"
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                         >
//                                             <div className="review-header">
//                                                 <span className="review-author">
//                                                     {review.user.name}
//                                                 </span>
//                                                 <div className="review-rating">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <FiStar
//                                                             key={i}
//                                                             className={i < review.rating ? 'filled' : ''}
//                                                         />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                             <p className="review-text">{review.comment}</p>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             )} */}
//                         </motion.div>
//                     </AnimatePresence>
//                 </div>
//             </motion.div>
//             <HomeProducts />
//             <Footer />
//         </>
//     );
// };

// export default ProductDetail;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiTruck } from 'react-icons/fi';
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
    const [openFaq, setOpenFaq] = useState(0);
    const [selectedWeight, setSelectedWeight] = useState('');
    const { addToCart } = useCart();

    const navigate = useNavigate();

    // const weightOptions = [
    //     { size: '100g', price: 129, originalPrice: 159 },
    //     { size: '250g', price: 249, originalPrice: 299 },
    //     { size: '400g', price: 379, originalPrice: 449 },
    //     { size: '1kg', price: 899, originalPrice: 1099 },
    // ];

    // const selectedOption = weightOptions.find(option => option.size === selectedWeight) || weightOptions[1];

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

    const faqs = [
        {
            question: 'Is this product naturally sourced?',
            answer: 'Yes, our products are naturally sourced with no added chemicals, preservatives, or artificial colors.',
        },
        {
            question: 'How should I store this product?',
            answer: 'Store in a cool, dry place away from direct sunlight. Keep the container tightly sealed to maintain freshness.',
        },
        {
            question: 'What is the shelf life?',
            answer: 'The product has a shelf life of 12 months from the date of manufacture when stored properly.',
        },
        {
            question: 'Is it tested for quality?',
            answer: 'Yes, every batch is lab-tested for purity, quality, and authenticity.',
        },
    ];

    const reviews = [
        {
            id: 1,
            name: 'Priya Sharma',
            rating: 5,
            date: 'Dec 5, 2024',
            comment: 'Excellent quality! The color and aroma are amazing. You can tell this is pure product.',
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            rating: 5,
            date: 'Dec 1, 2024',
            comment: 'Best product I have ever bought. The packaging is great and the product is very fresh.',
        },
        {
            id: 3,
            name: 'Anita Desai',
            rating: 4,
            date: 'Nov 28, 2024',
            comment: 'Good quality product. Will definitely order again. Fast delivery too!',
        },
    ];

    const handleAddToCart = () => {
        if (product) {
            // Use the existing addToCart function signature from your CartContext
            addToCart(product._id, quantity, {
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || '',
                weight: product.weight,
                originalPrice: product.originalPrice
            });
            
            // Optional: Show a success message or feedback
            console.log('Product added to cart:', {
                id: product._id,
                quantity,
                price: product.price
            });
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    // Function to format specifications with line breaks
    const formatSpecifications = (specText) => {
        if (!specText) return null;
        
        // Split by line breaks and bullet points
        const lines = specText.split(/\n|\r\n/);
        
        return lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            // Check if line starts with a bullet point or dash
            if (trimmedLine.match(/^[•\-*]\s/) || trimmedLine.match(/^\d+[\.\)]\s/)) {
                return (
                    <li key={index} className="spec-item">
                        {trimmedLine.replace(/^[•\-*]\s/, '').replace(/^\d+[\.\)]\s/, '')}
                    </li>
                );
            }
            
            // Check if line contains colon (key: value format)
            if (trimmedLine.includes(':')) {
                const [key, ...valueParts] = trimmedLine.split(':');
                const value = valueParts.join(':').trim();
                return (
                    <div key={index} className="spec-key-value">
                        <span className="spec-key">{key.trim()}:</span>
                        <span className="spec-value"> {value}</span>
                    </div>
                );
            }
            
            // Regular paragraph
            return (
                <p key={index} className="spec-paragraph">
                    {trimmedLine}
                </p>
            );
        });
    };

    // Function to format description with line breaks
    const formatDescription = (descText) => {
        if (!descText) return null;
        
        const paragraphs = descText.split(/\n\s*\n/);
        
        return paragraphs.map((paragraph, index) => (
            <p key={index} className="desc-paragraph">
                {paragraph.trim()}
            </p>
        ));
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
            <div className="product-detail-wrapper">
                <div className="product-detail-container">
                    {/* Breadcrumb */}
                    <div className="breadcrumb">
                        <Link to="/" className="breadcrumb-link">Home</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/shop" className="breadcrumb-link">Shop</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{product.name}</span>
                    </div>

                    {/* Product Section */}
                    <div className="product-grid">
                        {/* Product Image */}
                        <div className="product-image-section">
                            <div className="main-image-container">
                                <motion.div
                                    className="main-image"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <motion.img
                                        key={selectedImage}
                                        src={product.images?.[selectedImage]?.url || ''}
                                        alt={product.name}
                                        initial="hidden"
                                        animate="visible"
                                        variants={imageVariants}
                                    />
                                </motion.div>
                            </div>

                            <div className="thumbnail-grid">
                                {product.images?.map((image, index) => (
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

                        {/* Product Details */}
                        <div className="product-details">
                            <div>
                                <p className="product-brand">{product.brand}</p>
                                <h1 className="product-title">{product.name}</h1>
                                
                                <div className="product-rating-section">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={i < (product.rating || 4.8) ? 'filled' : ''}
                                            />
                                        ))}
                                    </div>
                                    <span className="review-count">({product.reviewCount || 234} reviews)</span>
                                </div>

                                <div className="price-section-new">
                                    <span className="current-price-new">
                                        ₹{product.discountPrice}
                                    </span>
                                    <span className="original-price-new">
                                        ₹{product.price}
                                    </span>
                                    <span className="discount-badge-new">
                                        Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                                    </span>
                                </div>

                                <div className="product-description">
                                    {formatDescription(product.description)}
                                </div>

                                {/* Quality Badges */}
                                <div className="quality-badges">
                                    <h4 className="quality-title">
                                        <span className="check-icon">✓</span>
                                        Lab Tested | Naturally Sourced | No Colors Added
                                    </h4>
                                    <div className="badges-grid">
                                        <div className="badge-item">
                                            <div className="badge-icon">🏆</div>
                                            <div>
                                                <p className="badge-text">Lab Tested</p>
                                                <p className="badge-desc">Quality Guaranteed</p>
                                            </div>
                                        </div>
                                        <div className="badge-item">
                                            <div className="badge-icon">🌿</div>
                                            <div>
                                                <p className="badge-text">Naturally Sourced</p>
                                                <p className="badge-desc">No Chemicals</p>
                                            </div>
                                        </div>
                                        <div className="badge-item">
                                            <div className="badge-icon">🛡️</div>
                                            <div>
                                                <p className="badge-text">FSSAI Certified</p>
                                                <p className="badge-desc">Quality Assured</p>
                                            </div>
                                        </div>
                                        <div className="badge-item">
                                            <div className="badge-icon">🚚</div>
                                            <div>
                                                <p className="badge-text">Free Shipping</p>
                                                <p className="badge-desc">On orders above ₹499</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="quantity-section-new">
                                    <div className="quantity-control-new">
                                        <span className="quantity-label">Quantity:</span>
                                        <div className="quantity-buttons">
                                            <motion.button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                whileTap={{ scale: 0.95 }}
                                                className="quantity-btn"
                                            >
                                                -
                                            </motion.button>
                                            <motion.span
                                                key={quantity}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="quantity-display"
                                            >
                                                {quantity}
                                            </motion.span>
                                            <motion.button
                                                onClick={() => setQuantity(quantity + 1)}
                                                whileTap={{ scale: 0.95 }}
                                                className="quantity-btn"
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                        <span className="weight-per-unit">{product.weight} per unit</span>
                                    </div>

                                    {product.quantity > 0 ? (
                                        <p className="stock-status in-stock">
                                            <span className="check-icon-small">✓</span>
                                            In Stock - Ready to Ship
                                        </p>
                                    ) : (
                                        <p className="stock-status out-of-stock">Out of Stock</p>
                                    )}
                                </div>

                                {/* Delivery Info */}
                                <div className="delivery-info-new">
                                    <FiTruck />
                                    <span>Free Shipping on orders above ₹499</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons-new">
                                    <motion.button
                                        className="add-to-cart-new"
                                        onClick={handleAddToCart}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={product.quantity === 0}
                                    >
                                        <FiShoppingCart />
                                        Add to Cart
                                    </motion.button>

                                    <motion.button
                                        className="buy-now-new"
                                        onClick={handleBuyNow}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={product.quantity === 0}
                                    >
                                        Buy Now
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="tabs-container">
                        <div className="tabs-header">
                            {['description', 'specifications', 'reviews', 'faq'].map((tab) => (
                                <motion.button
                                    key={tab}
                                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                    whileHover={{ y: -2 }}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <motion.div
                                            className="tab-underline"
                                            layoutId="tab-underline"
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
                                className="tab-content-new"
                            >
                                {activeTab === 'description' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="description-content"
                                    >
                                        <h3>Product Description</h3>
                                        {formatDescription(product.description)}
                                    </motion.div>
                                )}

                                {activeTab === 'specifications' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="specifications-content"
                                    >
                                        <h3>Product Specifications</h3>
                                        {product.specification ? (
                                            <div className="specifications-list">
                                                {formatSpecifications(product.specification)}
                                            </div>
                                        ) : (
                                            <p className="no-specifications">No specifications available.</p>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="reviews-content">
                                        <div className="reviews-header">
                                            <div>
                                                <h3>Customer Reviews</h3>
                                                <p className="reviews-count">{product.reviewCount || 234} reviews</p>
                                            </div>
                                            <button className="write-review-btn">Write a Review</button>
                                        </div>

                                        <div className="reviews-list">
                                            {reviews.map((review) => (
                                                <motion.div
                                                    key={review.id}
                                                    className="review-card-new"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="review-header-new">
                                                        <div>
                                                            <p className="review-author">{review.name}</p>
                                                            <div className="review-rating">
                                                                {[...Array(review.rating)].map((_, i) => (
                                                                    <FiStar
                                                                        key={i}
                                                                        className="filled"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="review-date">{review.date}</p>
                                                        </div>
                                                    </div>
                                                    <p className="review-text">{review.comment}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'faq' && (
                                    <div className="faq-content">
                                        <h3>Frequently Asked Questions</h3>
                                        <div className="faq-list">
                                            {faqs.map((faq, index) => (
                                                <div key={index} className="faq-item">
                                                    <button
                                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                                        className="faq-question"
                                                    >
                                                        <span>{faq.question}</span>
                                                        <span className="faq-icon">
                                                            {openFaq === index ? '▲' : '▼'}
                                                        </span>
                                                    </button>
                                                    {openFaq === index && (
                                                        <div className="faq-answer">
                                                            {faq.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {/* <HomeProducts /> */}
            <Footer />
        </>
    );
};

export default ProductDetail;