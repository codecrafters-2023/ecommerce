import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Header from '../../components/header'
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tempFilters, setTempFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 20
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/users/getAllProducts`, {
            params: appliedFilters
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/users/categories`)
        ]);

        setProducts(productsRes.data.products);
        setTotalPages(productsRes.data.totalPages);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductsAndCategories();
  }, [appliedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({
      ...tempFilters,
      page: 1 // Reset to first page when applying new filters
    });
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
      limit: 20
    };
    setTempFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const handlePageChange = (newPage) => {
    setAppliedFilters(prev => ({ ...prev, page: newPage }));
  };


  return (
    <>
      <Header />
      <div className="product-list-container">
        {/* Search and Filters Section */}
        <div className="product-list-header">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              name="search"
              value={tempFilters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <select
                name="category"
                value={tempFilters.category}
                onChange={handleFilterChange}
              >
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            

            {/* Add Filter Buttons Here */}
            <div className="filter-buttons">
              <button
                type="button"
                className="apply-filters"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button
                type="button"
                className="clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="product-list-main">
          {/* Price Filter Sidebar */}
          <div className="price-filter-sidebar">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                name="minPrice"
                value={tempFilters.minPrice}
                onChange={handleFilterChange}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                name="maxPrice"
                value={tempFilters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>


          {/* Product Grid */}
          <div className="product-grid">
            {products.length === 0 ? (
              <div className="no-results">
                <h2>No products found</h2>
                <p>Try adjusting your search filters</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <Link to={`/productDetail/${product._id}`}>
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                      />
                    </Link>
                    {/* <button className="quick-view-button">
                      uick View
                    </button> */}
                  </div>

                  <div className="product-details">
                    <h3 className="product-brand">{product.brand}</h3>
                    <h3 className="product-title">{product.name}</h3>
                    {/* <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < 4 ? 'filled' : ''} />
                      ))}
                      <span>({product.reviews})</span>
                    </div> */}

                    <div className="price-container">
                      <span className="current-price">
                        ${product.discountPrice}
                      </span>
                      {product.price && (
                        <span className="original-price">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <button
                      className="add-to-cart-button"
                      onClick={() => addToCart(product._id)}
                    >
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="modern-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`pagination-item ${tempFilters.page === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductListPage;
