import React from 'react';
import { Link } from 'react-router-dom'
import './index.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="text-content">
                    <h1 className="hero-title">New Collection 2024</h1>
                    <p className="hero-subtitle">Discover our curated selection of premium fashion</p>
                    <div className="cta-buttons">
                        <Link to={'/shop'} className="cta-primary">Shop Now</Link>
                        <Link to={'/shop'} className="cta-secondary">Explore More</Link>
                    </div>
                </div>
                <div className="image-content">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Fashion Collection"
                        className="hero-image"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;