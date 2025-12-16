// // HeroSectionAlt.js
// import React, { useEffect, useState } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { FiTruck, FiHeadphones } from 'react-icons/fi';
// import './HeroSection.css';
// import { Link } from 'react-router-dom';

// const HeroSection = () => {
//     const [animated, setAnimated] = useState(false);
//     const { ref, inView } = useInView({
//         triggerOnce: true,
//         threshold: 0.1,
//     });

//     useEffect(() => {
//         if (inView) setAnimated(true);
//     }, [inView]);

//     return (
//         <section ref={ref} className="hero-alt">
//             <div className="hero-background" aria-hidden="true"></div>

//             <div className={`hero-content ${animated ? 'animated' : ''}`}>
//                 <div className="product-info">
//                     <h1 id="title">
//                         <span>Premium</span>
//                         Turmeric Powder
//                     </h1>
//                     <p className="subtitle">With Natural Curcumin Extract</p>
//                     <div className="features">
//                         <div className="feature-item">
//                             <FiTruck className="feature-icon" />
//                             <span>Free Worldwide Shipping</span>
//                         </div>
//                         <div className="feature-item">
//                             <FiHeadphones className="feature-icon" />
//                             <span>24/7 Support</span>
//                         </div>
//                     </div>
//                     <button className="cta-button">
//                         <Link to={'/shop'}>Shop Now <span className="cta-arrow">→</span></Link>
//                     </button>
//                 </div>

//                 <div className="product-visual">
//                     <img
//                         src={process.env.PUBLIC_URL + '/farfoo.png'}
//                         alt="Turmeric Powder"
//                         className="main-product"
//                     />
//                     <div className="particles">
//                         <div className="particle particle-1"></div>
//                         <div className="particle particle-2"></div>
//                         <div className="particle particle-3"></div>
//                     </div>
//                 </div>
//             </div>

//             {/* <div className="service-cards">
//                 <div className="service-card">
//                     <FiClock className="service-icon" />
//                     <h3>Fast Delivery</h3>
//                     <p>Same day shipping</p>
//                     <div className="timing">15:30 • 16:30 • 17:00</div>
//                 </div>
//             </div> */}
//         </section>
//     );
// };

// export default HeroSection;



// HeroSectionAlt.js
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FiTruck, FiHeadphones, FiClock } from 'react-icons/fi';
import { ShoppingBag, Truck, Award, Leaf, Star, ArrowRight, Shield, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';
import './HeroSection.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [animated, setAnimated] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) setAnimated(true);
    }, [inView]);

    const scrollToNextSection = () => {
        const exploreSection = document.getElementById('explore-section');
        if (exploreSection) {
            exploreSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section ref={ref} className="hero-modern" id="hero-section">
            {/* Modern Hero Background */}
            <div className="hero-background-modern" aria-hidden="true"></div>

            {/* Big Animated Logo at Top Center */}
            <motion.div 
                className="hero-logo"
                initial={{ opacity: 0, y: -30 }}
                animate={{ 
                    opacity: 1, 
                    y: [0, -4, 0],
                    rotate: [0, 1, -1, 0],
                }}
                transition={{ 
                    opacity: { duration: 0.8 },
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    rotate: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
            >
                <img 
                    src={process.env.PUBLIC_URL + '/logo.png'} 
                    alt="FarFoo" 
                    className="logo-image"
                />
            </motion.div>

            <div className="hero-container">
                <div className="hero-grid">
                    {/* Left Content */}
                    <div className="hero-content-left">
                        {/* Top Badge */}
                        <div className="hero-badge">
                            <Sparkles className="badge-icon" />
                            <span>Certified Quality Standards</span>
                        </div>

                        {/* Main Headline */}
                        <div className="hero-headline">
                            <h1>
                                Nature's Finest,<br />
                                Delivered Pure
                            </h1>
                            <p className="hero-subtitle">
                                FarFoo: Fresh Food from Farm to You
                            </p>
                            <p className="hero-description">
                                Experience the authentic essence of nature with FarFoo's premium turmeric and spices, 
                                sourced directly from organic farms across India.
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="trust-badge">
                                <div className="badge-icon-wrapper">
                                    <CheckCircle className="badge-icon-inner" />
                                </div>
                                <span>Lab Tested</span>
                            </div>
                            <div className="trust-badge">
                                <div className="badge-icon-wrapper">
                                    <Shield className="badge-icon-inner" />
                                </div>
                                <span>FSSAI Certified</span>
                            </div>
                            <div className="trust-badge">
                                <div className="badge-icon-wrapper">
                                    <Truck className="badge-icon-inner" />
                                </div>
                                <div className="badge-text">
                                    <span>Free Delivery*</span>
                                    <small>(On orders above ₹499)</small>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="hero-ctas">
                            <Link 
                                to="/shop" 
                                className="cta-primary"
                            >
                                <ShoppingBag className="cta-icon" />
                                <span>Explore Products</span>
                                <ArrowRight className="cta-icon" />
                            </Link>
                            
                            <Link 
                                to="/about" 
                                className="cta-secondary"
                            >
                                <span>Our Story</span>
                                <ArrowRight className="cta-icon" />
                            </Link>
                        </div>
                    </div>

                    {/* Right - Product Showcase */}
                    <div className="hero-product-showcase">
                        {/* Animated Glow Rings */}
                        <motion.div
                            className="glow-ring"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="glow-ring-inner"></div>
                        </motion.div>

                        {/* Floating Badges */}
                        <motion.div 
                            className="floating-badge fssai-badge"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="badge-content">
                                <div className="badge-icon-container">
                                    <Shield className="badge-icon" />
                                </div>
                                <div>
                                    <p className="badge-title">FSSAI</p>
                                    <p className="badge-subtitle">Certified</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="floating-badge color-badge"
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 2.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        >
                            <div className="badge-content">
                                <div className="badge-icon-container">
                                    <Sparkles className="badge-icon" />
                                </div>
                                <div>
                                    <p className="badge-title">No Added</p>
                                    <p className="badge-title">Colors</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="floating-badge preservative-badge"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 3.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.8
                            }}
                        >
                            <div className="badge-content">
                                <div className="badge-icon-container">
                                    <CheckCircle className="badge-icon" />
                                </div>
                                <div>
                                    <p className="badge-title">No Preservatives</p>
                                    <p className="badge-subtitle">Added</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="floating-badge lab-badge"
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.3
                            }}
                        >
                            <div className="badge-content">
                                <Award className="badge-icon" />
                                <div>
                                    <p className="badge-title">Lab</p>
                                    <p className="badge-title">Tested</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Image */}
                        <motion.div 
                            className="product-image-wrapper"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 2, -2, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <motion.div
                                className="product-glow"
                                animate={{
                                    opacity: [0.4, 0.8, 0.4],
                                    scale: [0.95, 1.05, 0.95],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="product-glow-inner"></div>
                            </motion.div>

                            <motion.img
                                src={process.env.PUBLIC_URL + '/farfoo.png'}
                                alt="Turmeric Powder"
                                className="main-product-enhanced"
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 5,
                                    transition: { duration: 0.3 }
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Down Button */}
            <motion.button
                onClick={scrollToNextSection}
                className="scroll-down-btn"
                animate={{
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="scroll-down-content">
                    <div className="scroll-line"></div>
                    <div className="scroll-circle">
                        <ChevronDown className="scroll-arrow" />
                    </div>
                </div>
            </motion.button>
        </section>
    );
};

export default HeroSection;