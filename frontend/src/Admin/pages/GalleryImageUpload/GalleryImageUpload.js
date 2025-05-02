import React, { useState } from 'react';
import axios from 'axios';
import './GalleryAdmin.css';
import AdminSidebar from '../../components/Navbar';
import GalleryAdminList from '../../components/GalleryList/GalleryList';
import { FiUploadCloud, FiLoader } from 'react-icons/fi';

const GalleryImageUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState('');

    const handleFileChange = (file) => {
        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setFileError('Please select an image to upload');
            return;
        }
        if (!title) {
            // Handle title error if needed
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/gallery/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setTitle('');
            setFile(null);
            setPreview('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminSidebar />
            <div className="gau-container">
                <h2 className="gau-header">Upload New Content</h2>
                <form onSubmit={handleSubmit} className="gau-form">
                    <div className="gau-form-group">
                        <label className="gau-form-label">Image Title</label>
                        <input
                            type="text"
                            className="gau-form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter image title"
                            required
                        />
                    </div>

                    <div className="gau-file-upload">
                        <label
                            className={`gau-upload-label ${isDragging ? 'dragover' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            aria-required="true"
                            aria-invalid={!!fileError}
                        >
                            {preview ? (
                                <div className="gau-preview-container">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="gau-preview-image"
                                    />
                                </div>
                            ) : (
                                <div className="gau-upload-placeholder">
                                    <FiUploadCloud className="gau-upload-icon" />
                                    <div className="gau-upload-instruction">
                                        Drag & drop image or click to browse
                                    </div>
                                    <div className="gau-upload-subtext">
                                        Recommended size: 1920x1080px (JPG, PNG, WEBP)
                                    </div>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => {
                                    setFileError('');
                                    handleFileChange(e.target.files[0]);
                                }}
                                className="file-input"
                                accept="image/*"
                                aria-hidden="true"
                                style={{ display: 'none' }}
                                tabIndex="-1"
                            />
                        </label>
                        {fileError && (
                            <div className="gau-error-message" role="alert">
                                {fileError}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="gau-upload-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="gau-loading-spinner" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FiUploadCloud />
                                Upload Image
                            </>
                        )}
                    </button>
                </form>
            </div>
            <GalleryAdminList />
        </>
    );
};

export default GalleryImageUpload;