import React, { useState } from 'react';
import './NewsletterSignup.css';
import { Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);

        // Validate email
        if (!/\S+@\S+\.\S+/.test(email)) {
            setIsError(true);
            return;
        }

        setIsLoading(true);
        
        // Simulate API call with delay
        setTimeout(() => {
            setIsSubscribed(true);
            setEmail('');
            setIsLoading(false);
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setIsSubscribed(false);
            }, 5000);
        }, 1500);
    };

    return (
        <section className="newsletter-modern">
            <div className="newsletter-container">
                <div className="newsletter-content">
                    {/* Success Message Overlay */}
                    {isSubscribed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="newsletter-success-overlay"
                        >
                            <div className="success-content">
                                <div className="success-icon-wrapper">
                                    <CheckCircle className="success-icon" />
                                </div>
                                <div className="success-text">
                                    <h3 className="success-title">Successfully Subscribed!</h3>
                                    <p className="success-message">
                                        Thank you for joining our community. Check your email for exclusive offers.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Header */}
                    <div className="newsletter-header">
                        <div className="newsletter-badge">
                            <span>✉️ Stay Connected</span>
                        </div>
                        <h2 className="newsletter-title">
                            Get Exclusive Offers & Updates
                        </h2>
                        <p className="newsletter-description">
                            Join our community and be the first to know about new products and special deals.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <div className="form-content">
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsError(false);
                                    }}
                                    placeholder="Enter your email address"
                                    className={`newsletter-input ${isError ? 'error' : ''}`}
                                    disabled={isLoading || isSubscribed}
                                    required
                                />
                                {isError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="error-message"
                                    >
                                        Please enter a valid email address
                                    </motion.p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="newsletter-button"
                                disabled={isLoading || isSubscribed}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : isSubscribed ? (
                                    'Subscribed!'
                                ) : (
                                    'Subscribe Now'
                                )}
                            </button>
                        </div>

                        {/* Privacy Note */}
                        {/* <p className="privacy-note">
                            By subscribing, you agree to receive marketing emails from FarFoo. 
                            We respect your privacy. Unsubscribe at any time.
                        </p> */}
                    </form>

                    {/* Benefits */}
                    {/* <div className="newsletter-benefits">
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Sparkles className="benefit-icon-svg" />
                            </div>
                            <span className="benefit-text">Exclusive Member Discounts</span>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Sparkles className="benefit-icon-svg" />
                            </div>
                            <span className="benefit-text">Early Access to New Products</span>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Sparkles className="benefit-icon-svg" />
                            </div>
                            <span className="benefit-text">Seasonal Recipes & Tips</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignup;