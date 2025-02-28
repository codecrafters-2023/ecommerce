import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import "./index.css"
import AdminSidebar from '../../components/Navbar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const fetchProducts = async (page = 1) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/getAllProducts/?page=${page}&limit=10`);
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePageClick = (data) => {
        fetchProducts(data.selected);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add handleDelete function
    const handleDelete = async (productId) => {
        // if (!window.confirm('Are you sure you want to delete this product?')) {
        //     return;
        // }

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/deleteProduct/${productId}`);
            // Refresh the product list after deletion
            fetchProducts(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
            console.error('Delete error:', err);
        }
    };

    return (
        // <div className="product-list">
        //     <h2>Manage Products</h2>
        //     <table>
        //         <thead>
        //             <tr>
        //                 <th>Name</th>
        //                 <th>Price</th>
        //                 <th>Images</th>
        //                 <th>Actions</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {products.map(product => (
        //                 <tr key={product._id}>
        //                     <td>{product.name}</td>
        //                     <td>${product.price}</td>
        //                     <td>
        //                         {product.images.slice(0, 3).map((img, index) => (
        //                             <img
        //                                 key={index}
        //                                 src={img.url}
        //                                 alt={`Product ${index + 1}`}
        //                                 style={{ width: '50px', marginRight: '5px' }}
        //                             />
        //                         ))}
        //                     </td>
        //                     <td>
        //                         <Link to={`/productEdit/${product._id}`}>
        //                             Edit
        //                         </Link>
        //                         <button onClick={() => handleDelete(product._id)}>
        //                             Delete
        //                         </button>
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>

        //     {/* Pagination */}
        //     <div className="pagination">
        //         {Array.from({ length: totalPages }, (_, i) => (
        //             <button
        //                 key={i + 1}
        //                 onClick={() => fetchProducts(i + 1)}
        //                 disabled={currentPage === i + 1}
        //             >
        //                 {i + 1}
        //             </button>
        //         ))}
        //     </div>
        // </div>
        <>
        <AdminSidebar/>
            <div className="admin-list-container">
                <div className="admin-header">
                    <h1>Product Management</h1>
                    <Link to={'/AddProduct'} className="admin-button primary">
                        + New Product
                    </Link>
                </div>


                <div className="list-table-wrapper">
                    <table className="admin-list-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-info-cell">
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-id">ID: {product._id}</span>
                                        </div>
                                    </td>
                                    <td>${product.price}</td>
                                    <td>
                                        <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td>{product.category || 'Uncategorized'}</td>
                                    <td>
                                        <div className="image-thumbnails">
                                            {product.images.slice(0, 3).map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img.url}
                                                    alt={`Product ${index + 1}`}
                                                    className="thumbnail"
                                                />
                                            ))}
                                            {product.images.length > 3 && (
                                                <div className="more-images">+{product.images.length - 3}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/productEdit/${product._id}`}
                                                className="admin-button outline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="admin-button danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination-container'}
                    pageClassName={'pagination-item'}
                    activeClassName={'active'}
                    previousClassName={'pagination-nav'}
                    nextClassName={'pagination-nav'}
                    disabledClassName={'disabled'}
                />
            </div>
        </>
    );
};

export default ProductList;