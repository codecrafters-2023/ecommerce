// WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
    const features = [
        {
            icon: '🚀',
            title: "Fast Delivery",
            description: "Get your orders delivered within 24-48 hours across major cities"
        },
        {
            icon: '💎',
            title: "Quality Assurance",
            description: 'Circumin content on dry basis 3.85% Lead Chromate: Negative'
        },
        {
            icon: '🛡️',
            title: "Secure Payments",
            description: "100% secure payment gateway with SSL encryption"
        },
        {
            icon: '🎁',
            title: "Easy Returns",
            description: "7-day hassle-free return policy"
        }
    ];

    return (
        <section className="why-choose-us">
            <div className="section__header">
                <h2>Why Choose Us</h2>
                {/* <p className="subtitle">Experience the difference</p> */}
            </div>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div
                        className="feature-card"
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <div className="icon-wrapper">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;