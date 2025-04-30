import React from 'react';
import '../PrivacyPolicy/PrivacyPolicy.css';
import Header from '../header';
import Footer from '../Footer/Footer';

const ContactInformation = () => {
    return (
        <>
            <Header />
            <div className="privacy-container">
                <main className="privacy-content">
                    <h2 style={{ marginBottom: "20px", fontSize: "2.5rem", textAlign: "center" }}>Contact Information</h2>
                    <p>Trade name: FarFoo</p>
                    <p>Phone number: 9814207077</p>
                    <p>Email: <a href='mailto:kam@gurmaanitservices.com' style={{ textDecoration: "underline", fontWeight: "600" }}>kam@gurmaanitservices.com</a></p>
                    <p>Physical address: kahangarh, 148026 Kahangarh PB, India</p>
                </main>
            </div>
            <Footer />
        </>
    );
}

export default ContactInformation;