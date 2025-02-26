import React from "react";
import Header from "../../components/header";
import Hero from "../../components/heroSection";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      {/* Hero Section */}
      <Hero />

      {/* About Us Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
            Who We Are
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center">
            <strong>Gurmaan IT Services LLP</strong> is a premier IT solutions provider dedicated to
            helping businesses grow through cutting-edge technology. Our expert team specializes in 
            <span className="text-blue-500 font-semibold"> web development, mobile app development, cloud computing, and digital marketing.</span>
          </p>

          <div className="border-t border-gray-200 my-8"></div>

          <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center">
            We strive to transform businesses with <strong>modern technology</strong> by delivering 
            <span className="text-blue-500 font-semibold"> high-quality, cost-effective, and scalable IT solutions.</span>  
            Our commitment to innovation ensures long-term partnerships with our clients, providing 
            continuous support and growth.
          </p>

          <div className="mt-8 flex justify-center">
            <a href="/contact" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
