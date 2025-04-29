// NewsletterSignup.jsx
import React, { useState } from 'react';
import './NewsletterSignup.css';

const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (/\S+@\S+\.\S+/.test(email)) {
            // Simulate API call
            setTimeout(() => {
                setIsSubscribed(true);
                setEmail('');
            }, 1000);
            setIsError(false);
        } else {
            setIsError(true);
        }
    };

    return (
        <section className="newsletter-section">
            <div className={`newsletter-container ${isSubscribed ? 'success' : ''}`}>
                {!isSubscribed ? (
                    <>
                        <h2 className="newsletter-title">Get Exclusive Offers!</h2>
                        <p className="newsletter-text">
                            Subscribe to our newsletter for 10% off your first order
                        </p>
                        <form onSubmit={handleSubmit} className="newsletter-form">
                            <div className={`input-group ${isError ? 'error' : ''}`}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    required
                                />
                                <button type="submit" className="newsletter-button">
                                    Subscribe
                                </button>
                            </div>
                            {isError && (
                                <p className="error-message">Please enter a valid email</p>
                            )}
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <svg
                            className="checkmark"
                            viewBox="0 0 52 52"
                        >
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <h2>Thank you for subscribing!</h2>
                        <p>Check your inbox for your discount code</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsletterSignup;