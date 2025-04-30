// import React, { useState } from "react";
// import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import Header from "../../components/header";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//     phone: "",
//     num1: Math.floor(Math.random() * 10),
//     num2: Math.floor(Math.random() * 10),
//     captcha: ""
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePhoneChange = (value) => {
//     setFormData({ ...formData, phone: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const correctAnswer = formData.num1 + formData.num2;
//     if (parseInt(formData.captcha) !== correctAnswer) {
//       alert("Captcha is incorrect. Please try again.");
//       return;
//     }
//     alert("Message sent successfully!");
//   };

//   return (
//     <div>
//       <Header />
//       <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
//         {/* Contact Form */}
//         <div className="md:w-2/3 bg-white p-6 shadow-lg rounded-lg">
//           <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Your Name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Your Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded"
//             />
//             <PhoneInput
//               country={"in"}
//               value={formData.phone}
//               onChange={handlePhoneChange}
//               inputClass="w-full p-2 border rounded"
//             />
//             <textarea
//               name="message"
//               placeholder="Your Message"
//               value={formData.message}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded"
//             ></textarea>
//             {/* CAPTCHA */}
//             <div className="flex items-center gap-2">
//               <span>{formData.num1} + {formData.num2} =</span>
//               <input
//                 type="number"
//                 name="captcha"
//                 value={formData.captcha}
//                 onChange={handleChange}
//                 required
//                 className="p-2 border rounded"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>

//         {/* Contact Details */}
//         <div className="md:w-1/3 bg-gray-100 p-6 shadow-lg rounded-lg">
//           <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
//           <p className="flex items-center gap-2"><FaMapMarkerAlt /> Kamal Ghuman, Kahangarh, Sangrur, Punjab, 148026</p>
//           <p className="flex items-center gap-2 mt-2"><FaPhone /> +91 9814207077</p>
//           <p className="flex items-center gap-2 mt-2"><FaClock /> Open 24/7</p>
//         </div>
//       </div>

//       {/* Google Maps
//       <div className="w-full h-64 mt-6">
//         <iframe
//           title="Google Maps"
//           className="w-full h-full"
//           src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Kahangarh,Sangrur,Punjab"
//           allowFullScreen
//         ></iframe>
//       </div> */}
//     </div>
//   );
// };

// export default Contact;


import React from 'react';
import './Contact.css';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="contact-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <h1>Your Gateway to Pure, Natural Goodness</h1>
            <p className="hero-subtitle">Fresh Food From Farm to You!</p>
          </div>
        </section>

        {/* Content Section */}
        <div className="content-wrapper">
          {/* Left Panel - Contact Cards */}
          <div className="contact-cards">
            <article className="contact-card">
              <div className="card-header">
                <span className="card-icon">🌱</span>
                <h2>Connect with FarFoo</h2>
              </div>
              <div className="card-body">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <h3>Our Farm Location</h3>
                    <p>Kahangarh, 148026<br />Punjab, India</p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">👥</span>
                  <div>
                    <h3>Team Contacts</h3>
                    <p className="contact-team">
                      <strong>Sales:</strong> ChahatPreet Singh<br />
                      <a href="tel:+918558022853">+91 8558022853</a>
                    </p>
                    <p className="contact-team">
                      <strong>Operations:</strong> Kuldeep Singh<br />
                      <a href="tel:+918804997000">+91 8804997000</a>
                    </p>
                    <p className="contact-team">
                      <strong>IT/Design:</strong> Kamal Ghuman<br />
                      <a href="tel:+919814207077">+91 9814207077</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <h3>Email Us</h3>
                    <a href="mailto:Farfoo@gurmaanitservices.com" className="email-link">
                      Farfoo@gurmaanitservices.com
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <div className="farm-philosophy">
              <h3>Our Philosophy</h3>
              <p>We're committed to delivering high-quality, unadulterated products straight from nature to your doorstep.</p>
              <div className="certification-badge">
                <span>🍃 100% Natural</span>
                <span>🌍 Sustainable Farming</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <form className="contact-form">
            <h2 className="form-title">Send Us a Message</h2>

            <div className="form-group floating">
              <input type="text" id="name" required />
              <label htmlFor="name">Full Name</label>
              <div className="underline"></div>
            </div>

            <div className="form-group floating">
              <input type="email" id="email" required />
              <label htmlFor="email">Email Address</label>
              <div className="underline"></div>
            </div>

            <div className="form-group floating">
              <input type="tel" id="phone" required />
              <label htmlFor="phone">Contact Number</label>
              <div className="underline"></div>
            </div>

            <div className="form-group floating">
              <textarea id="message" rows="3" required></textarea>
              <label htmlFor="message">Your Message</label>
              <div className="underline"></div>
            </div>

            <button type="submit" className="submit-btn">
              <span>Send Message</span>
              <div className="hover-effect"></div>
            </button>
          </form>
        </div>

        {/* Interactive Map Section */}
        <div className="map-section">
          <iframe
            title="farm-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.454799121767!2d75.67825831512689!3d30.62335048167099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a3dcfd9c5d8b5%3A0x2e5e0a2d4f2a4b1c!2sKahangarh%2C%20Punjab%20148026!5e0!3m2!1sen!2sin!4v1658912345678!5m2!1sen!2sin"
            className="interactive-map"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;