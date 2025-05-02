import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Gallery.css';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

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
    });

    if (loading) {
        return (
            <div className="gallery">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="gallery-item">
                        <div className="loading-skeleton"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <Header />
                <div className="gallery-header">
                    <h2>Our Visual Portfolio</h2>
                    <p>Exploring Innovation Through Imagery</p>
                </div>
            <div className="gallery">
                {images.map(image => (
                    <div key={image._id} className="gallery-item">
                        <img src={image.path} alt={image.filename} />
                        <div className="caption">
                            <p>{image.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default Gallery;