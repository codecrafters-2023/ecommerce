import axios from 'axios';
import AdminSidebar from '../../components/Navbar';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: []
  });
  const [files, setFiles] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each file must be smaller than 5MB');
        return;
      }
    });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);

      files.forEach((file) => {
        data.append('images', file);
      });

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/addProducts`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data) {
        toast.success('Product created successfully!');
        // Reset form
        setFormData({ name: '', price: '', description: '', images: [] });
        setFiles([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating product');
    }
  };
  return (
    <div>
      <AdminSidebar />
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          
          <textarea
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          ></textarea>
          

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
