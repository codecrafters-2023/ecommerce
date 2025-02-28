import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./index.css"
import AdminSidebar from '../Navbar';

const ProductEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [files, setFiles] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/getProductDetail/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                navigate('/products');
            }
        };
        fetchProduct();
    }, [id, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('description', product.description);
        formData.append('deletedImages', JSON.stringify(deletedImages));

        // files.forEach(file => {
        //     formData.append('newImages', file);
        // });

        for (let i = 0; i < files.length; i++) {
            formData.append('newImages', files[i]);
        }

        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/products/updateProduct/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data) {
                navigate('/allProducts');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImageDelete = (publicId) => {
        setDeletedImages([...deletedImages, publicId]);
        setProduct({
            ...product,
            images: product.images.filter(img => img.publicId !== publicId)
        });
    };

    if (!product) return <div>Loading...</div>;

    return (
        <>

            <AdminSidebar />
            <div className="form-container">
                <div className="form-header">
                    <h1>Edit Product</h1>
                    <button
                        onClick={() => navigate('/allProducts')}
                        className="back-button"
                    >
                        ← Back to Products
                    </button>
                </div>


                <form onSubmit={handleSubmit} className="product-edit-form">
                    <div className="form-columns">
                        <div className="form-fields">
                            <div className="form-group">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    className="form-textarea"
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="image-section">
                            <div className="form-group">
                                <label className="form-label">Existing Images</label>
                                <div className="image-grid">
                                    {product.images.map((img, index) => (
                                        <div key={img.publicId} className="image-item">
                                            <img
                                                src={img.url}
                                                alt={`Product ${index + 1}`}
                                                className="product-image"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(img.publicId)}
                                                className="delete-image-btn"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Add New Images</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => setFiles([...e.target.files])}
                                        accept="image/*"
                                        id="file-input"
                                        className="file-input"
                                    />
                                    <label htmlFor="file-input" className="file-upload-label">
                                        <span className="upload-icon">📁</span>
                                        <span>Click to upload or drag and drop</span>
                                        <small>PNG, JPG up to 2MB</small>
                                    </label>
                                </div>
                                <div className="file-previews">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-preview">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="preview-image"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                                className="remove-preview-btn"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductEditForm;