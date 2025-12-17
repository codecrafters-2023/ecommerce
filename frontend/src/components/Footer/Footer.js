import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Mail, Phone, MapPin, CreditCard, Smartphone, Banknote, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="footer-modern">
            {/* Subtle Pattern Background */}
            <div className="footer-background-pattern"></div>

            {/* Main Content */}
            <div className="footer-container">
                {/* Footer Grid */}
                <div className="footer-grid">
                    {/* Logo & Brand Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="footer-logo-section"
                    >
                        <div className="logo-glow-wrapper">
                            <div className="logo-glow"></div>
                            <img 
                                src={`${process.env.PUBLIC_URL}/logo.png`} 
                                alt="FarFoo" 
                                className="footer-logo" 
                            />
                        </div>
                        <p className="brand-message">
                            Premium natural products from farm to your home. Quality assured and ethically sourced.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="social-icons-wrapper">
                            <motion.a
                                href="https://www.instagram.com/farfoo.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="social-link instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} className="social-icon" />
                            </motion.a>
                            <motion.a
                                href="https://www.facebook.com/people/FarFoo/61572242198690/?rdid=aPSXbQTDD3K2eVi6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1PvLMkWSiK"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="social-link facebook"
                            >
                                <FontAwesomeIcon icon={faFacebook} className="social-icon" />
                            </motion.a>
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="social-link linkedin"
                            >
                                <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Company */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="footer-column"
                    >
                        <h4 className="column-title">Company</h4>
                        <ul className="column-links">
                            <li>
                                <Link 
                                    to="/about" 
                                    className="column-link"
                                >
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/shop" 
                                    className="column-link"
                                >
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/gallery" 
                                    className="column-link"
                                >
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/contact" 
                                    className="column-link"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Policies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="footer-column"
                    >
                        <h4 className="column-title">Policies</h4>
                        <ul className="column-links">
                            <li>
                                <Link 
                                    to="/privacy-policy" 
                                    className="column-link"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/terms-conditions" 
                                    className="column-link"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/shipping-policy" 
                                    className="column-link"
                                >
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/refund-policy" 
                                    className="column-link"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="#" 
                                    className="column-link"
                                >
                                    FSSAI License
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Support & Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="footer-column"
                    >
                        <h4 className="column-title">Support</h4>
                        <ul className="column-links">
                            <li>
                                <Link 
                                    to="/faq" 
                                    className="column-link"
                                >
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/contact" 
                                    className="column-link"
                                >
                                    Customer Support
                                </Link>
                            </li>
                        </ul>
                        
                        {/* Contact Info */}
                        <div className="contact-info">
                            <a 
                                href="mailto:Farfoo@gurmaanITservices.com" 
                                className="footer-contact-item"
                            >
                                <div className="contact-icon-wrapper">
                                    <Mail className="footer-contact-icon" />
                                </div>
                                <span className="contact-text">Farfoo@gurmaanitservices.com</span>
                            </a>
                            <a 
                                href="tel:+918558022853" 
                                className="footer-contact-item"
                            >
                                <div className="contact-icon-wrapper">
                                    <Phone className="footer-contact-icon" />
                                </div>
                                <span className="contact-text">+91 8558022853 (Sales)</span>
                            </a>
                            <a 
                                href="https://maps.app.goo.gl/f6adWhBvgo1b61Up9" 
                                className="footer-contact-item"
                            >
                                <div className="contact-icon-wrapper">
                                    <MapPin className="footer-contact-icon" />
                                </div>
                                <span className="contact-text">Kahangarh, Punjab</span>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="footer-divider">
                    {/* Animated Gradient Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="gradient-line"
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="shimmer-line"
                    />
                    
                    {/* Payment Methods */}
                    <div className="payment-methods">
                        <p className="payment-title">We Accept</p>
                        <div className="payment-icons">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="payment-method"
                            >
                                <CreditCard className="payment-icon" />
                                <span className="payment-text">Cards</span>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="payment-method"
                            >
                                <Smartphone className="payment-icon" />
                                <span className="payment-text">UPI</span>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="payment-method"
                            >
                                <svg className="payment-custom-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L2 7v10c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5z" fill="#3B291A"/>
                                </svg>
                                <span className="payment-text">GPay</span>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="payment-method"
                            >
                                <Banknote className="payment-icon" />
                                <span className="payment-text">COD</span>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="payment-method"
                            >
                                <svg className="payment-custom-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.7 7.7L14 15.4 10.3 11.7 2.3 19.7 3.7 21.1 10.3 14.5 14 18.2 23 9.2 21.7 7.7Z" fill="#3B291A"/>
                                    <path d="M14 2L2 9.5V11L14 3.5V2Z" fill="#3B291A"/>
                                </svg>
                                <span className="payment-text">Razorpay</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="copyright-section">
                        <p className="copyright-text">
                            © 2025 FarFoo. All rights reserved.
                        </p>
                        <p className="tagline">
                            Fresh Food From Farm, to YOU!
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Yellow Badge at Bottom */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="footer-floating-badge"
            >
                <motion.div
                    animate={{ 
                        y: [0, -10, 0],
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="badge-wrapper"
                >
                    {/* Glow Effect */}
                    <div className="badge-glow"></div>
                    
                    {/* Badge */}
                    <div className="footer-badge-content">
                        <div className="footer-badge-icon-wrapper">
                            <ShieldCheck className="badge-main-icon" />
                        </div>
                        <div className="badge-text-wrapper">
                            <p className="footer-badge-text">
                                Payment Security by <span className="badge-highlight">Razorpay</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;