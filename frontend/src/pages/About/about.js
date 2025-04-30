// import React from "react";
// import Header from "../../components/header";

// const About = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header />

//       {/* About Us Content */}
//       <div className="container mx-auto px-6 py-12">
//         <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
//           <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
//             Who We Are
//           </h2>
//           <p className="text-gray-700 text-lg leading-relaxed text-center">
//             <strong>Gurmaan IT Services LLP</strong> is a premier IT solutions provider dedicated to
//             helping businesses grow through cutting-edge technology. Our expert team specializes in 
//             <span className="text-blue-500 font-semibold"> web development, mobile app development, cloud computing, and digital marketing.</span>
//           </p>

//           <div className="border-t border-gray-200 my-8"></div>

//           <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">
//             Our Mission
//           </h2>
//           <p className="text-gray-700 text-lg leading-relaxed text-center">
//             We strive to transform businesses with <strong>modern technology</strong> by delivering 
//             <span className="text-blue-500 font-semibold"> high-quality, cost-effective, and scalable IT solutions.</span>  
//             Our commitment to innovation ensures long-term partnerships with our clients, providing 
//             continuous support and growth.
//           </p>

//           <div className="mt-8 flex justify-center">
//             <a href="/contact" className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition">
//               Get in Touch
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;

import React from 'react';
import Header from '../../components/header';
import './About.css';
import Footer from '../../components/Footer/Footer';

const About = () => {
  return (
    <>
      <Header />
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-banner">
          <div className="banner-content">
            <h1 className="banner-title">Our Story</h1>
            {/* <p className="banner-subtitle">Building the Future of E-Commerce</p> */}
            {/* <button className="banner-cta">Discover More</button> */}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            {/* <h2 className="section_title">About Us</h2> */}
            <p className="mission-text">
              Welcome to <span>FarFoo</span>, where purity meets freshness! We are more than just a brand—we are a commitment to delivering high-quality, unadulterated products straight from nature to your doorstep.
            </p>

            <h3>Who We Are</h3>
            <p className="mission-text">
              FarFoo is a proud subsidiary of <span>Gurmaan IT Services LLP</span>, a company known for its innovation and excellence. Our mission is simple: to bring you the finest, purest, and most natural products directly from farmers while ensuring top-tier quality and freshness.
            </p>

            <h3>Our Commitment to Purity</h3>
            <p className="mission-text">
              <ul>
                <li><span>100% Natural </span>– No artificial flavors, additives, or preservatives.</li>
                <li><span>Ethically Sourced </span>– Every item undergoes strict quality testing for purity and authenticity.</li>
                <li><span>Lab Tested & Certified </span>- Each product is fully tested under the guidance of <span>Punjab Agricultural University</span>, Ludhiana, ensuring the highest quality and safety standards.</li>
              </ul>
            </p>

            <h3>What Sets Us Apart?</h3>
            <p className="mission-text">
              <ul>
                <li><span>Farm-to-Table Freshness </span>– We partner with trusted farmers to bring you products straight from the source.</li>
                <li><span>Uncompromised Quality </span>– Every item undergoes strict quality testing for purity and authenticity.</li>
                <li><span>Sustainability & Fair Trade </span>- We support sustainable farming practices and fair compensation for farmers.</li>
              </ul>
            </p>

            <h3>Our Vision</h3>
            <p className="mission-text">
              We aim to be the most trusted brand for natural and unadulterated products, helping people lead healthier lives while supporting local farmers and sustainable agriculture.
            </p>

            <h3>Join Us on Our Journey</h3>
            <p className="mission-text">
              At FarFoo, we are passionate about purity. Whether you are looking for fresh organic produce, naturally processed foods, or chemical-free essentials, we’ve got you covered. Join us in embracing a lifestyle where health, taste, and sustainability go hand in hand.
            </p>
          </div>
        </section>

        {/* Divider */}
        {/* <div className="section-divider"></div>

        <section className="highlights-section">
          <div className="highlight-card">
            <div className="highlight-icon">🚚</div>
            <h3>Global Shipping</h3>
            <p>Fast & reliable delivery to 150+ countries</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">💎</div>
            <h3>Curated Quality</h3>
            <p>Rigorous selection of premium products</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🛡️</div>
            <h3>Secure Shopping</h3>
            <p>Military-grade transaction security</p>
          </div>
        </section> */}

        {/* Team Section */}
        {/* <section className="team-section">
        <h2 className="section_title">The Minds Behind Farfoo</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="member-photo">
              <img src="https://via.placeholder.com/400x500" alt="Team Member" />
              <div className="member-info">
                <h3>Alex Johnson</h3>
                <p>CEO & Visionary</p>
              </div>
            </div>
          </div>
          <div className="team-card">
            <div className="member-photo">
              <img src="https://via.placeholder.com/400x500" alt="Team Member" />
              <div className="member-info">
                <h3>Sarah Chen</h3>
                <p>CTO & Tech Lead</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

        {/* Values Section */}
        <section className="values-section">
          <h2 className="section_title">Our Core Principles</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>01</h3>
              <div className="value-content">
                <h4>Free Shipping</h4>
                <p>Free Shipping for orders over ₹500.</p>
              </div>
            </div>
            <div className="value-item">
              <h3>02</h3>
              <div className="value-content">
                <h4>Online Support</h4>
                <p>We are available on Social Media and phone.</p>
              </div>
            </div>
            <div className="value-item">
              <h3>03</h3>
              <div className="value-content">
                <h4>Quality Assurance</h4>
                <p>Circumin content on dry basis 3.85%</p>
                <p>Lead Chromate: Negative</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;
