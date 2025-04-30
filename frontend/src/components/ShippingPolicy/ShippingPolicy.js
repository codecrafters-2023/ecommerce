import React from 'react';
import '../PrivacyPolicy/PrivacyPolicy.css';
import Header from '../header';
import Footer from '../Footer/Footer';

const ShippingPolicy = () => {
    return (
        <>
            <Header />
            <div className="privacy-container">
                <main className="privacy-content">
                    <h2 style={{ marginBottom: "20px", fontSize: "2.5rem", textAlign: "center" }}>Shipping Policy</h2>
                    <h3>Shipping Charges</h3>

                    <ul>
                        <li><strong>Free Shipping:</strong>
                            <ul>
                                <li>All orders above INR 500 within India are eligible for free shipping.</li>
                            </ul>
                        </li>
                        <li><strong>Shipping Charges:</strong>
                            <ul>
                                <li>For orders below INR 500, a standard shipping charge will be applied. The exact amount will be displayed at checkout.</li>
                            </ul>
                        </li>
                        
                    </ul>

                    <h3>Shipping Time</h3>
                    <ul>
                        <li>We aim to process and ship all orders within 2-3 business days.</li>
                        <li>Estimated delivery time within India is 10 business days.</li>
                        <li>Please note that delivery times may vary due to factors such as location, courier service, and unforeseen circumstances.</li>
                    </ul>

                    <h3>Courier Partners</h3>
                    <p>We partner with all major courier service providers in India to ensure reliable and timely delivery.</p>

                    <h3>Packaging</h3>
                    <p>Your order will be carefully packed to ensure safe delivery. We use high-quality packaging materials to protect your products during transit.</p>

                    <h3>Order Tracking</h3>
                    <p>Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on the courier's website.</p>

                    <h3>Shipping Address</h3>
                    <p>Please ensure that the shipping address provided is accurate and complete. We are not responsible for delays or non-delivery due to incorrect or incomplete shipping information.</p>

                    <h3>Returns and Refunds</h3>
                    <p>Please refer to our Returns and Refunds Policy for more information on our return and exchange process.</p>

                    <h3>Contact Us</h3>
                    <p>If you have any questions or concerns regarding our shipping policy, please contact our customer support team.</p>
                    <p>Email: <a href='mailto:Kam@gurmaanitservices.com' style={{ textDecoration: "underline", fontWeight: "600" }}>Kam@gurmaanitservices.com</a></p>
                    <p>Phone: +91 9814207077</p>
                </main>
            </div>
            <Footer />
        </>
    );
}

export default ShippingPolicy;