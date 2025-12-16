import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Gallery.css';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import { X } from 'lucide-react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Products', 'Farms', 'Farming'];

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/gallery`);
                setImages(res.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => img.category === activeCategory);

    if (loading) {
        return (
            <>
                <Header />
                <div id="gallery-main-container">
                    <div className="gallery-container">
                    {/* Page Header Skeleton */}
                    <div className="gallery-header-skeleton">
                        <div className="gallery-title-skeleton"></div>
                        <div className="gallery-subtitle-skeleton"></div>
                    </div>

                    {/* Category Filter Skeleton */}
                    {/* <div className="gallery-categories-skeleton">
                        {categories.map((_, index) => (
                            <div key={index} className="category-skeleton"></div>
                        ))}
                    </div> */}

                    {/* Gallery Grid Skeleton */}
                    <div className="gallery-grid">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="gallery-card-skeleton">
                                <div className="gallery-image-skeleton"></div>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div id="gallery-main-container">
                <div className="gallery-container">
                {/* Page Header */}
                <div className="gallery-header">
                    <h1 className="gallery-title">Gallery</h1>
                    <p className="gallery-subtitle">
                        A visual journey through our farms, products, and processes
                    </p>
                </div>

                {/* Category Filter */}
                {/* <div className="gallery-categories">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`gallery-category-btn ${activeCategory === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div> */}

                {/* Gallery Grid */}
                <div className="gallery-grid">
                    {filteredImages.map((image) => (
                        <div
                            key={image._id}
                            onClick={() => setSelectedImage(image.path)}
                            className="gallery-card"
                        >
                            <div className="gallery-image-container">
                                <img
                                    src={image.path}
                                    alt={image.filename}
                                    className="gallery-image"
                                />
                                <div className="gallery-image-overlay">
                                    <div className="gallery-image-info">
                                        <h4 className="gallery-image-title">{image.title || image.filename}</h4>
                                        {image.category && (
                                            <p className="gallery-image-category">{image.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div
                        className="gallery-lightbox"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="gallery-lightbox-close"
                        >
                            <X className="lightbox-close-icon" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Gallery"
                            className="gallery-lightbox-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* CTA Section */}
                <section className="gallery-cta">
                    <div className="gallery-cta-content">
                        <h2 className="gallery-cta-title">Experience the FarFoo Difference</h2>
                        <p className="gallery-cta-text">
                            From our farms to your table, every step is taken with care and dedication
                        </p>
                        <div className="gallery-cta-buttons">
                            <a href="/shop" className="btn-primary">
                                Shop Now
                            </a>
                            <a href="/about" className="btn-secondary">
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>
            </div>
            </div>
            <Footer />
        </>
    );
};

export default Gallery;