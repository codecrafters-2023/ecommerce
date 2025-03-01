import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import "./index.css"
import AdminSidebar from '../../components/Navbar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10); // You can make this configurable

    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async (page = 0) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/products/getAllProducts/?page=${page + 1}&limit=${itemsPerPage}&search=${searchTerm}`
            );
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load products');
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setItemsPerPage(newLimit);
        setCurrentPage(0); // Reset to first page when changing page size
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
        fetchProducts(data.selected);
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/deleteProduct/${productId}`);

            // Check if we need to go to previous page
            if (products.length === 1 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchProducts(currentPage);
            }

            toast.success('Product deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
            console.error('Delete error:', err);
        }
    };

    return (
        <>
            <AdminSidebar />
            <div className="admin-list-container">
            <div className="admin-header">
                    <h1>Product Management</h1>
                    <div className="admin-controls">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search products or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="fas fa-search"></i>
                        </div>
                        <Link to={'/AddProduct'} className="admin-button primary">
                            + New Product
                        </Link>
                    </div>
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
                                        <span className={`status-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
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
                <div className="pagination-controls">
                    <div className="page-size-selector">
                        <span>Items per page: </span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="page-size-select"
                        >
                            {[10, 20, 30, 50].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
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
                        forcePage={currentPage}
                    />
                </div>


            </div>
        </>
    );
};

export default ProductList;