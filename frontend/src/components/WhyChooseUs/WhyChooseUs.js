import React from 'react';
import './WhyChooseUs.css';
import { Sparkles, Zap, BadgeCheck, ShieldCheck, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
    const features = [
        {
            id: 1,
            title: "Express Delivery",
            description: "Quick delivery in 3-5 business days across India",
            icon: Zap,
            gradientFrom: "#F3D35C",  // Changed from iconGradient
            gradientTo: "#D4A75B",    // Changed from iconGradient
            partner: {
                name: "Delhivery",
                text: "Powered by",
                color: "#E41B34"
            },
            borderColor: "#F3D35C",
            animationDelay: 0
        },
        {
            id: 2,
            title: "FSSAI Certified",
            description: "Every product is lab tested and meets highest food safety standards",
            icon: BadgeCheck,
            gradientFrom: "#4F8F3C",  // Changed from iconGradient
            gradientTo: "#8CCB5E",    // Changed from iconGradient
            partner: {
                name: "FSSAI",
                text: "Licensed by",
                color: "#4F8F3C"
            },
            borderColor: "#4F8F3C",
            animationDelay: 0.1
        },
        {
            id: 3,
            title: "Secure Payments",
            description: "100% safe & encrypted transactions with multiple payment options",
            icon: ShieldCheck,
            gradientFrom: "#D4A75B",  // Changed from iconGradient
            gradientTo: "#F3D35C",    // Changed from iconGradient
            partner: {
                name: "Razorpay",
                text: "Secured by",
                color: "#072654"
            },
            borderColor: "#D4A75B",
            animationDelay: 0.2
        },
        {
            id: 4,
            title: "Easy Returns",
            description: "7-day return policy for unopened products with original packaging and seals intact",
            icon: PackageCheck,
            gradientFrom: "#8CCB5E",  // Changed from iconGradient
            gradientTo: "#4F8F3C",    // Changed from iconGradient
            partner: {
                name: "Hassle-free Process",
                text: "",
                color: "#8CCB5E"
            },
            borderColor: "#8CCB5E",
            animationDelay: 0.3
        }
    ];

    return (
        <section className="why-choose-us-modern">
            <div className="why-choose-container">
                {/* Section Header */}
                <motion.div 
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-badge">
                        <Sparkles className="badge-icon" />
                        <span>The FarFoo Advantage</span>
                    </div>
                    <h2 className="why-section-title">Why Choose FarFoo</h2>
                    <p className="section-description">
                        Premium quality, trusted partners, and hassle-free experience - that's our promise to you
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="features-grid">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: feature.animationDelay }}
                            className="feature-card-group"
                        >
                            <div className="feature-card">
                                <div className="relative z-10 text-center space-y-4">
                                    {/* Animated Icon Container */}
                                    <motion.div 
                                        className="icon-container"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})`
                                        }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        animate={{ 
                                            y: [0, -8, 0],
                                        }}
                                        transition={{
                                            y: {
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: feature.animationDelay
                                            }
                                        }}
                                    >
                                        <feature.icon className="feature-icon" strokeWidth={2.5} />
                                    </motion.div>
                                    
                                    {/* Title */}
                                    <h3 className="feature-title">{feature.title}</h3>
                                    
                                    {/* Description */}
                                    <p className="feature-description">{feature.description}</p>
                                    
                                    {/* Partner Badge */}
                                    <div className="partner-badge">
                                        {feature.partner.text && (
                                            <span className="partner-text">{feature.partner.text}</span>
                                        )}
                                        <span 
                                            className="partner-name"
                                            style={{ color: feature.partner.color }}
                                        >
                                            {feature.partner.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;