// Footer.js
import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
// import logo from './logo.png'; // Replace with your logo path

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Links Grid */}
                <div className="footer-grid">
                    <div className="footer-column animate-slide-up">
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="footer-logo" />
                    </div>

                    <div className="footer-column animate-slide-up">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/gallery">Gallery</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column animate-slide-up">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="refund-policy">Refund Policy</Link></li>
                            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                            <li><Link to="/terms-of-services">Terms of Service</Link></li>
                            <li><Link to="/contact-information">Contact Information</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column animate-slide-up">
                        <h4>Our Mission</h4>
                        <p>To bring the natural goodness of turmeric to every home by offering the purest and highest-quality turmeric products.</p>
                    </div>
                </div>
                    <div className="social-icons">
                        <Link className='social' to="https://www.instagram.com/farfoo.in" target='_blank'><FontAwesomeIcon icon={faInstagram} /></Link>
                        <Link className='social' to="https://www.facebook.com/people/FarFoo/61572242198690/?rdid=aPSXbQTDD3K2eVi6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1PvLMkWSiK" target='_blank'><FontAwesomeIcon icon={faFacebook} /></Link>
                        <Link className='social' to="#"><FontAwesomeIcon icon={faLinkedin} /></Link>
                    </div>
            </div>

            {/* Policy Links and Copyright */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} FarFoo. Designed by <Link to={'https://gurmaanitservices.com'} target='_blank' style={{textDecoration:"underline"}}>Gurmaan IT Services</Link>.</p>
            </div>
        </footer>
    );
};

export default Footer;