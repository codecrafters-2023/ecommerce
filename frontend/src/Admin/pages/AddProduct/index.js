// import axios from 'axios';
// import AdminSidebar from '../../components/Navbar';
// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const AddProduct = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     description: '',
//     images: []
//   });
//   const [files, setFiles] = useState([]);
//   // const [loading, setLoading] = useState(false);
//   // const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleFileChange = (e) => {
//     setFiles([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (files.length > 5) {
//       toast.error('Maximum 5 images allowed');
//       return;
//     }

//     files.forEach(file => {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Each file must be smaller than 5MB');
//         return;
//       }
//     });

//     try {
//       const data = new FormData();
//       data.append('name', formData.name);
//       data.append('price', formData.price);
//       data.append('description', formData.description);

//       files.forEach((file) => {
//         data.append('images', file);
//       });

//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/products/addProducts`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (res.data) {
//         toast.success('Product created successfully!');
//         // Reset form
//         setFormData({ name: '', price: '', description: '', images: [] });
//         setFiles([]);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error creating product');
//     }
//   };
//   return (
//     <div>
//       <AdminSidebar />
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-4">Add Product</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full p-2 border rounded"
//           />
//           <input
//             type="text"
//             name="name"
//             placeholder="Product Name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={formData.price}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             required
//           />

//           <textarea
//             name="description"
//             placeholder="Short Description"
//             value={formData.description}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//           ></textarea>


//           <button
//             type="submit"
//             className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
//           >
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
















import axios from 'axios';
import AdminSidebar from '../../components/Navbar';
import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import "./index.css"

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    quantity: 0,
    discountPrice: '',
    weight: '',
    specification: '',
    // colors: [],
  });


  console.log(formData);
  

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle all input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        colors: checked
          ? [...prev.colors, value]
          : prev.colors.filter(color => color !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  }, []);

  // File validation and handling
  const handleFileSelection = (rawFiles) => {
    const newFiles = Array.from(rawFiles);

    // Validate number of files
    if (newFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate each file
    const validFiles = newFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Final validation
    if (files.length === 0) {
      toast.error('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append product data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'colors') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append image files
      files.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Send request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/products/addProducts`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 201) {
        toast.success('Product created successfully!');
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          category: '',
          brand: '',
          quantity: 0,
          discountPrice: '',
          weight: '',
          colors: [],
        });
        setFiles([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
     <div className="admin-layout">
      <AdminSidebar />
      
      <div className="add-product-wrapper">
        <div className="form-header">
          <h1>Add New Product</h1>
          <p>Fill in the product details below</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Product Basic Info */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="turmeric powder">Turmeric Powder</option>
                  {/* {/* <option value="fashion">Fashion</option> */}
                  <option value="Jaggery Powder">Jaggery Powder</option>
                </select>
              </div>

              <div className="input-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="form-section">
            <h2 className="section-title">Pricing & Inventory</h2>
            <div className="form-grid">
              <div className="input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Color Selection */}
          {/* <div className="form-section">
            <h2 className="section-title">Available Colors</h2>
            <div className="color-grid">
              {['red', 'blue', 'black', 'white', 'green'].map(color => (
                <label key={color} className="color-option">
                  <input
                    type="checkbox"
                    name="colors"
                    value={color}
                    checked={formData.colors.includes(color)}
                    onChange={handleInputChange}
                  />
                  <span className={`color-box ${color}`}>
                    {formData.colors.includes(color) && <span className="checkmark">✓</span>}
                  </span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Image Upload */}
          <div className="form-section">
            <h2 className="section-title">Product Images</h2>
            <div 
              className={`image-upload ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelection(e.target.files)}
                id="file-input"
                style={{display:"none"}}
              />
              <label htmlFor="file-input">
                <div className="upload-content">
                  <span className="upload-icon">📷</span>
                  <div className="upload-text">
                    <p>Drag & drop images here</p>
                    <p>or click to browse</p>
                    <small>Max 5 images (5MB each)</small>
                  </div>
                </div>
              </label>
              
              <div className="image-previews">
                {files.map((file, index) => (
                  <div key={index} className="preview-item">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2 className="section-title">Product Description</h2>
            <div className="input-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>

          {/* Specification */}
          <div className="form-section">
            <h2 className="section-title">Product Specifications</h2>
            <div className="input-group">
              <textarea
                name="specification"
                value={formData.specification}
                onChange={handleInputChange}
                rows="5"
                placeholder="Enter detailed product specification..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
    </>
    // <div className="add-product-container">
    //   <AdminSidebar />
    //   <div className="add-product-main">
    //     <form className="add-product-form" onSubmit={handleSubmit}>
    //       {/* File Upload Section */}
    //       <div
    //         className={`file-upload-wrapper ${isDragging ? 'dragging' : ''}`}
    //         onDragOver={handleDragOver}
    //         onDragLeave={handleDragLeave}
    //         onDrop={handleDrop}
    //       >
    //         <input
    //           type="file"
    //           multiple
    //           accept="image/*"
    //           onChange={(e) => handleFileSelection(e.target.files)}
    //           className="file-input"
    //           id="file-upload"
    //         />
    //         <label htmlFor="file-upload" className="drop-zone-label">
    //           <span className="upload-icon">📷</span>
    //           <p className="upload-instructions">
    //             {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
    //             <br />
    //             Maximum 5 images (5MB each)
    //           </p>
    //         </label>
    //         <div className="file-previews">
    //           {files.map((file, index) => (
    //             <div key={index} className="file-preview">
    //               <img
    //                 src={URL.createObjectURL(file)}
    //                 alt={`Preview ${index + 1}`}
    //               />
    //               <button
    //                 type="button"
    //                 onClick={() => removeFile(index)}
    //                 className="remove-file"
    //               >
    //                 ×
    //               </button>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Rest of the form inputs (same as previous) */}
    //       {/* Form Grid */}
    //       <div className="form-grid">
    //         {/* Left Column */}
    //         <div className="form-column">
    //           <div className="form-group">
    //             <label className="form-label">Product Name</label>
    //             <input
    //               type="text"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleInputChange}
    //               className="form-input"
    //               required
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Category</label>
    //             <select
    //               name="category"
    //               value={formData.category}
    //               onChange={handleInputChange}
    //               className="form-input"
    //               required
    //             >
    //               <option value="">Select Category</option>
    //               <option value="electronics">Electronics</option>
    //               <option value="fashion">Fashion</option>
    //               <option value="home">Home & Kitchen</option>
    //             </select>
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Brand</label>
    //             <input
    //               type="text"
    //               name="brand"
    //               value={formData.brand}
    //               onChange={handleInputChange}
    //               className="form-input"
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Quantity</label>
    //             <input
    //               type="number"
    //               name="quantity"
    //               value={formData.quantity}
    //               onChange={handleInputChange}
    //               className="form-input"
    //               min="0"
    //             />
    //           </div>
    //         </div>

    //         {/* Right Column */}
    //         <div className="form-column">
    //           <div className="form-group">
    //             <label className="form-label">Price</label>
    //             <input
    //               type="number"
    //               name="price"
    //               value={formData.price}
    //               onChange={handleInputChange}
    //               className="form-input"
    //               required
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Discount Price</label>
    //             <input
    //               type="number"
    //               name="discountPrice"
    //               value={formData.discountPrice}
    //               onChange={handleInputChange}
    //               className="form-input"
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Weight (kg)</label>
    //             <input
    //               type="number"
    //               name="weight"
    //               value={formData.weight}
    //               onChange={handleInputChange}
    //               className="form-input"
    //               step="0.1"
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label className="form-label">Colors</label>
    //             <div className="color-options">
    //               {['red', 'blue', 'black'].map(color => (
    //                 <label key={color} className="color-option">
    //                   <input
    //                     type="checkbox"
    //                     name="colors"
    //                     value={color}
    //                     checked={formData.colors.includes(color)}
    //                     onChange={handleInputChange}
    //                   />
    //                   <span className={`color-dot ${color}`}></span>
    //                   {color.charAt(0).toUpperCase() + color.slice(1)}
    //                 </label>
    //               ))}
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Description */}
    //       <div className="form-group">
    //         <label className="form-label">Description</label>
    //         <textarea
    //           name="description"
    //           value={formData.description}
    //           onChange={handleInputChange}
    //           className="form-input"
    //           rows="5"
    //         ></textarea>
    //       </div>

    //       <button
    //         type="submit"
    //         className="submit-button"
    //         disabled={isSubmitting}
    //       >
    //         {isSubmitting ? 'Creating Product...' : 'Add Product'}
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default AddProduct;