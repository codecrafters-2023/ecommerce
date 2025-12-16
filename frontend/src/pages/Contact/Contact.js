import React, { useState } from 'react';
import './Contact.css';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission - In production, send data to backend API
    alert('Message sent successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'Farfoo@gurmaanitservices.com',
      link: 'mailto:Farfoo@gurmaanITservices.com',
    },
    {
      icon: Phone,
      title: 'Sales',
      details: 'ChahatPreet Singh: +91 8558022853',
      link: 'tel:+918558022853',
    },
    {
      icon: Phone,
      title: 'Operations',
      details: 'Kuldeep Singh: +91 8804997000',
      link: 'tel:+918804997000',
    },
    {
      icon: MapPin,
      title: 'Our Farm Location',
      details: 'Kahangarh, 148026, Punjab, India',
      link: '#',
    },
  ];

  const faqItems = [
    {
      question: 'What are your delivery times?',
      answer: 'We typically deliver within 3-5 business days across India. Express delivery options are also available.',
    },
    {
      question: 'Do you offer bulk orders?',
      answer: 'Yes! We offer special pricing for bulk orders. Please contact us for more details.',
    },
    {
      question: 'Are your products certified?',
      answer: 'All our products are FSSAI approved and lab-tested for quality and purity.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unopened products. Customer satisfaction is our priority.',
    },
  ];

  return (
    <>
      <Header />
      <div className="contact-page">
        <div className="contact-container">
          {/* Page Header */}
          <div className="contact-header">
            <h1 className="contact-main-title">Get in Touch</h1>
            <p className="contact-subtitle">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="contact-cards-grid">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="contact-info-card"
              >
                <div className="contact-card-icon">
                  <info.icon className="contact-icon" />
                </div>
                <h4 className="contact-card-title">{info.title}</h4>
                <p className="contact-card-details">{info.details}</p>
              </a>
            ))}
          </div>

          {/* Contact Form & Info */}
          <div className="contact-form-section">
            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 className="contact-form-title">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-textarea"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send className="submit-icon" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Philosophy & Map */}
            <div className="philosophy-section">
              {/* Our Philosophy */}
              <div className="philosophy-card">
                <h3 className="philosophy-title">Our Philosophy</h3>
                <p className="philosophy-text">
                  At FarFoo, we believe in transparency, quality, and sustainability. Every product we offer
                  is a testament to our commitment to bringing pure, natural goodness from farms to your home.
                </p>
                <div className="philosophy-points">
                  <div className="philosophy-point">
                    <div className="point-icon">
                      <CheckCircle className="point-check-icon" />
                    </div>
                    <div>
                      <h4 className="point-title">Direct from Farms</h4>
                      <p className="point-description">We work directly with farmers to ensure freshness and fair trade.</p>
                    </div>
                  </div>
                  <div className="philosophy-point">
                    <div className="point-icon">
                      <CheckCircle className="point-check-icon" />
                    </div>
                    <div>
                      <h4 className="point-title">Lab Tested Quality</h4>
                      <p className="point-description">Every batch undergoes rigorous testing for purity and authenticity.</p>
                    </div>
                  </div>
                  <div className="philosophy-point">
                    <div className="point-icon">
                      <CheckCircle className="point-check-icon" />
                    </div>
                    <div>
                      <h4 className="point-title">Customer Focused</h4>
                      <p className="point-description">Your satisfaction and health are our top priorities.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="map-card">
                <div className="map-content">
                  <MapPin className="map-pin-icon" />
                  <h4 className="map-location-title">Kahangarh, 148026</h4>
                  <p className="map-location-subtitle">
                    Punjab, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <div className="faq-header">
              <h2 className="faq-title">Common Questions</h2>
              <p className="faq-subtitle">Quick answers to questions you may have</p>
            </div>

            <div className="faq-grid">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-card">
                  <h4 className="faq-question">{item.question}</h4>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;