import React, { useState } from "react";
import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Header from "../../components/header";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10),
    captcha: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctAnswer = formData.num1 + formData.num2;
    if (parseInt(formData.captcha) !== correctAnswer) {
      alert("Captcha is incorrect. Please try again.");
      return;
    }
    alert("Message sent successfully!");
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Contact Form */}
        <div className="md:w-2/3 bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputClass="w-full p-2 border rounded"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            ></textarea>
            {/* CAPTCHA */}
            <div className="flex items-center gap-2">
              <span>{formData.num1} + {formData.num2} =</span>
              <input
                type="number"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Send Message
            </button>
          </form>
        </div>
        
        {/* Contact Details */}
        <div className="md:w-1/3 bg-gray-100 p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="flex items-center gap-2"><FaMapMarkerAlt /> Kamal Ghuman, Kahangarh, Sangrur, Punjab, 148026</p>
          <p className="flex items-center gap-2 mt-2"><FaPhone /> +91 9814207077</p>
          <p className="flex items-center gap-2 mt-2"><FaClock /> Open 24/7</p>
        </div>
      </div>
      
      {/* Google Maps
      <div className="w-full h-64 mt-6">
        <iframe
          title="Google Maps"
          className="w-full h-full"
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Kahangarh,Sangrur,Punjab"
          allowFullScreen
        ></iframe>
      </div> */}
    </div>
  );
};

export default Contact;
