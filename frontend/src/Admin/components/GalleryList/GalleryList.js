import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GalleryList.css';

const GalleryAdminList = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/gallery/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setImages(images.filter(image => image._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchImages();
    });

    return (
        <div className="gl-admin-list-container">
            <h2 className="gl-list-heading">Manage Gallery Content</h2>
            {loading ? (
                <div className="gl-loading-state">Loading gallery items...</div>
            ) : (
                <div className="gl-image-list">
                    {images.map(image => (
                        <div key={image._id} className="gl-list-item">
                            <img 
                                src={image.path} 
                                alt={image.title} 
                                className="gl-item-thumbnail" 
                            />
                            <div className="gl-item-info">
                                <h3 className="gl-item-title">{image.title}</h3>
                                <p className="gl-item-date">
                                    Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(image._id)}
                                className="gl-delete-btn"
                            >
                                Delete Item
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GalleryAdminList;