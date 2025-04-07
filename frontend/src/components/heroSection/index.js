// HeroSectionAlt.js
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FiTruck, FiHeadphones } from 'react-icons/fi';
import './HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const [animated, setAnimated] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) setAnimated(true);
    }, [inView]);

    return (
        <section ref={ref} className="hero-alt">
            <div className="hero-background" aria-hidden="true"></div>

            <div className={`hero-content ${animated ? 'animated' : ''}`}>
                <div className="product-info">
                    <h1 className="title">
                        <span>Premium</span>
                        Turmeric Powder
                    </h1>
                    <p className="subtitle">With Natural Curcumin Extract</p>
                    <div className="features">
                        <div className="feature-item">
                            <FiTruck className="feature-icon" />
                            <span>Free Worldwide Shipping</span>
                        </div>
                        <div className="feature-item">
                            <FiHeadphones className="feature-icon" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                    <button className="cta-button">
                        <Link to={'/shop'}>Shop Now <span className="cta-arrow">→</span></Link>
                    </button>
                </div>

                <div className="product-visual">
                    <img
                        src={process.env.PUBLIC_URL + '/farfoo.png'}
                        alt="Turmeric Powder"
                        className="main-product"
                    />
                    <div className="particles">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                    </div>
                </div>
            </div>

            {/* <div className="service-cards">
                <div className="service-card">
                    <FiClock className="service-icon" />
                    <h3>Fast Delivery</h3>
                    <p>Same day shipping</p>
                    <div className="timing">15:30 • 16:30 • 17:00</div>
                </div>
            </div> */}
        </section>
    );
};

export default HeroSection;