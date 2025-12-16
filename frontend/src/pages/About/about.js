import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf, Award, Heart, Sparkles, Target, Shield, Building2,
  Users2, FlaskConical, MapPin, Rocket, TrendingUp, Globe,
  Users, Briefcase, ShoppingBag, Zap, ChevronRight, Check
} from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import './About.css';

const About = () => {
  // Core values data
  const values = [
    {
      id: 1,
      icon: Leaf,
      title: 'Naturally Sourced',
      description: 'We source only the finest natural ingredients, responsibly cultivated without harmful chemicals.',
      colorFrom: '#4F8F3C',
      colorTo: '#8CCB5E'
    },
    {
      id: 2,
      icon: Award,
      title: 'Lab Tested',
      description: 'Every product undergoes rigorous testing to ensure quality and safety standards.',
      colorFrom: '#F3D35C',
      colorTo: '#D4A75B'
    },
    {
      id: 3,
      icon: Heart,
      title: 'Ethically Sourced',
      description: 'We work directly with farmers to ensure fair trade and sustainable practices.',
      colorFrom: '#8CCB5E',
      colorTo: '#4F8F3C'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Quality Assured',
      description: 'Your satisfaction and health are our top priorities in everything we do.',
      colorFrom: '#D4A75B',
      colorTo: '#F3D35C'
    }
  ];

  // Timeline data
  const timelineData = [
    {
      year: '2019',
      title: 'Foundation',
      points: [
        'Gurmaan IT Services LLP was founded by two freelancers.',
        'Began with a small 4-member team, aiming to deliver affordable, high-quality IT solutions.'
      ],
      icon: Rocket,
      colorFrom: '#4F8F3C',
      colorTo: '#8CCB5E',
      position: 'left'
    },
    {
      year: '2020',
      title: 'Going Global',
      points: [
        'Transitioned from freelance work to structured IT service offerings.',
        'Started acquiring international clients, especially in the U.S.'
      ],
      icon: Globe,
      colorFrom: '#F3D35C',
      colorTo: '#D4A75B',
      position: 'right'
    },
    {
      year: '2021',
      title: 'Building Reputation',
      points: [
        'Established a strong reputation in software support services and custom IT development.',
        'Expanded workforce to meet growing client demand.'
      ],
      icon: TrendingUp,
      colorFrom: '#8CCB5E',
      colorTo: '#4F8F3C',
      position: 'left'
    },
    {
      year: '2022',
      title: 'Team Expansion',
      points: [
        'Added specialized developers, designers, and project managers.',
        'Strengthened presence across India, U.S., and Canada.'
      ],
      icon: Users,
      colorFrom: '#D4A75B',
      colorTo: '#F3D35C',
      position: 'right'
    },
    {
      year: '2023',
      title: 'Strategic Growth',
      points: [
        'Enhanced client base with long-term U.S. partnerships.',
        'Invested in scaling delivery capabilities and internal process automation.'
      ],
      icon: Briefcase,
      colorFrom: '#4F8F3C',
      colorTo: '#8CCB5E',
      position: 'left'
    },
    {
      year: '2024',
      title: 'FarFoo Launch',
      points: [
        'Launched FarFoo.in, a subsidiary focused on farm-sourced, natural products.',
        'Operations supported under guidance of Punjab Agricultural University, Ludhiana, with strict lab-tested quality.'
      ],
      icon: ShoppingBag,
      colorFrom: '#F3D35C',
      colorTo: '#D4A75B',
      position: 'right',
      highlight: true
    },
    {
      year: '2025',
      title: 'Trusted Global Partner',
      points: [
        'Gurmaan IT Services LLP is a trusted global IT partner, offering technology, logistics support, eCommerce, and agri-tech solutions.',
        'Diversified portfolio across IT services and consumer brands.'
      ],
      icon: Zap,
      colorFrom: '#8CCB5E',
      colorTo: '#4F8F3C',
      position: 'left'
    }
  ];

  // Research highlights
  const researchItems = [
    {
      id: 1,
      icon: MapPin,
      title: 'Pan-India Research',
      description: 'Our R&D team traveled across India to identify the best farming regions and raw produce sources.',
      colorFrom: '#4F8F3C',
      colorTo: '#8CCB5E'
    },
    {
      id: 2,
      icon: Users2,
      title: 'Academic Research',
      description: 'Studied research and received guidance from Punjab University Ludhiana for agricultural expertise and best practices.',
      colorFrom: '#F3D35C',
      colorTo: '#D4A75B'
    },
    {
      id: 3,
      icon: FlaskConical,
      title: 'Scientific Standards',
      description: 'Referenced CSIR-CFTRI research and theses to establish comprehensive food safety standards and quality testing protocols.',
      colorFrom: '#8CCB5E',
      colorTo: '#4F8F3C'
    }
  ];

  // Key points
  const keyPoints = [
    {
      id: 1,
      icon: Leaf,
      title: 'Sustainable Practices',
      description: 'Supporting eco-friendly farming methods'
    },
    {
      id: 2,
      icon: Heart,
      title: 'Community Impact',
      description: 'Empowering farmers and local communities'
    },
    {
      id: 3,
      icon: Shield,
      title: 'Quality Standards',
      description: 'FSSAI certified and lab tested products'
    }
  ];

  return (
    <>
      <Header />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <div className="badge">
                <Sparkles size={16} />
                <span>Our Journey</span>
              </div>
              <h1 className="hero-title">Our Story</h1>
              <p className="hero-subtitle">
                FarFoo was born from a simple belief: everyone deserves access to responsibly sourced, 
                natural products that nourish the body and respect the earth. We bridge the gap between 
                farms and your home, ensuring quality every step of the way.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Origin Story Section */}
        <section className="origin-section">
          <div className="container">
            <div className="origin-grid">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="origin-content"
              >
                <div className="badge badge-green">
                  <Building2 size={16} />
                  <span>A Subsidiary of Gurmaan IT Services LLP</span>
                </div>
                <h2>From IT Excellence to Food Innovation</h2>
                <p className="text-large">
                  FarFoo is a proud subsidiary of <span className="highlight">Gurmaan IT Services LLP</span>, 
                  a company built on the foundation of quality and innovation. While excelling in the IT sector, 
                  we observed a concerning trend—food product quality was declining day by day across India.
                </p>
                <p className="text-medium">
                  This realization sparked a mission. We assembled a dedicated Research & Development team 
                  and embarked on an extensive journey across India, searching for the finest raw produce 
                  our country has to offer.
                </p>
                <div className="info-card">
                  <p>
                    <span className="bold">Our commitment:</span> Through extensive research and guidance from 
                    prestigious institutions like <span className="bold">Punjab University Ludhiana</span> and 
                    <span className="bold"> CSIR - Central Food Technological Research Institute (CFTRI)</span>, 
                    we developed rigorous quality standards and sourcing protocols that define FarFoo today.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="origin-highlights"
              >
                {researchItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="research-card"
                  >
                    <div className="research-icon" style={{ background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})` }}>
                      <item.icon size={28} color="white" />
                    </div>
                    <div className="research-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-header"
            >
              <div className="badge">
                <Rocket size={16} />
                <span>Our Journey</span>
              </div>
              <h2>Milestones That Shaped Us</h2>
              <p className="section-subtitle">
                From a small freelance team to a global IT partner and premium food brand
              </p>
            </motion.div>

            <div className="timeline">
              <div className="timeline-line"></div>
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: item.position === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`timeline-item ${item.position}`}
                >
                  <div className={`timeline-card ${item.highlight ? 'highlight' : ''}`}>
                    <div className="about-card-header">
                      <div className="about-card-icon" style={{ background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})` }}>
                        <item.icon size={18} color="white" />
                      </div>
                      <div className="card-title">
                        <span className="year">{item.year}</span>
                        <h3>{item.title}</h3>
                      </div>
                    </div>
                    <ul className="card-points">
                      {item.points.map((point, idx) => (
                        <li key={idx}>
                          <span className="bullet">{item.highlight ? '•' : '•'}</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`timeline-dot ${item.highlight ? 'highlight' : ''}`} style={{ background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})` }}>
                    <div className="dot-inner"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-grid">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mission-image-container"
              >
                <div className="image-glow"></div>
                <img 
                  src={`${process.env.PUBLIC_URL + '/company.png'}`} 
                  alt="Gurmaan IT Services Building" 
                  className="mission-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL + '/company.jpg'}`;
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mission-content"
              >
                <div className="badge badge-green">
                  <Target size={16} />
                  <span>Our Mission</span>
                </div>
                <h2>Bridging Farms & Homes</h2>
                <p className="text-large">
                  To revolutionize how people access natural products by creating a transparent, 
                  sustainable supply chain that benefits both farmers and consumers.
                </p>
                <p className="text-medium">
                  We believe in the power of nature and the importance of preserving traditional farming 
                  methods while embracing modern quality standards. Every product we offer is a testament 
                  to our commitment to authenticity and excellence.
                </p>

                <div className="key-points-grid">
                  {keyPoints.map((point, index) => (
                    <motion.div
                      key={point.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="key-point-card"
                    >
                      <div className="point-icon">
                        <point.icon size={24} color="white" />
                      </div>
                      <div className="point-content">
                        <h4>{point.title}</h4>
                        <p>{point.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-header"
            >
              <div className="badge">
                <Sparkles size={16} />
                <span>What We Stand For</span>
              </div>
              <h2>Our Core Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="value-card"
                >
                  <div className="card-glow"></div>
                  <div className="value-content">
                    <div 
                      className="value-icon" 
                      style={{ background: `linear-gradient(135deg, ${value.colorFrom}, ${value.colorTo})` }}
                    >
                      <value.icon size={32} color="white" />
                    </div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-glow-1"></div>
          <div className="cta-glow-2"></div>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="cta-content"
            >
              <h2>Join Our Journey</h2>
              <p>
                Experience the difference of responsibly sourced, quality-assured natural products. 
                Start your journey to better health today.
              </p>
              <div className="cta-buttons">
                <motion.a
                  href="/shop"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Shop Now</span>
                  <Sparkles size={20} />
                </motion.a>
                <motion.a
                  href="/contact"
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Contact Us</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;