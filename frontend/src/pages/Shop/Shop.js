// import React from "react";
// import Header from "../../components/header";
// import { useCart } from "../../context/CartContext";
// import { Button } from "@relume_io/relume-ui";
// import "./index.css";

// const products = [
//   { id: 1, name: "Smart Watch", price: 55, color: "Black", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 2, name: "Wireless Headphones", price: 55, color: "Blue", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 3, name: "Bluetooth Speaker", price: 55, color: "Red", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 4, name: "Fitness Tracker", price: 55, color: "Green", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 5, name: "Laptop Stand", price: 55, color: "Silver", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 6, name: "Phone Case", price: 55, color: "Clear", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 7, name: "Gaming Mouse", price: 55, color: "Black", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
//   { id: 8, name: "Webcam HD", price: 55, color: "1080p", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" }
// ];

// const Shop = () => {
//   const { addToCart } = useCart();

//   return (
//     <div className="bg-gray-100 min-h-screen text-center">
//       <Header />
//       <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28 ">
//       <div className="mb-12 grid grid-cols-1 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:gap-x-12 lg:mb-20 lg:gap-x-20 ">
//             <div className="w-full max-w-lg ">
//               <p className="mb-3 font-semibold md:mb-4">Discover</p>
//               <h2 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-5xl ">Products</h2>
//               <p className="md:text-md">Explore our extensive range of quality products.</p>
//             </div>
//             <div className="hidden md:block">
//               <Button title="View all" variant="secondary">View all</Button>
//             </div>
//           </div>
//         <div className="container">

//           <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
//             {products.map((product) => (
//               <div key={product.id} className="cursor-pointer">
//                 <div className="mb-3 md:mb-4">
//                   <img src={product.image} alt={product.name} className="aspect-[10/12] size-full object-cover" />
//                 </div>
//                 <div className="mb-2">
//                   <p className="font-semibold md:text-md">{product.name}</p>
//                   <p className="text-sm">{product.color}</p>
//                 </div>
//                 <p className="text-md font-semibold md:text-lg">${product.price}</p>
//                 <button
//                   onClick={() => addToCart(product)}
//                   className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Shop;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Header from '../../components/header'
import { FiStar, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 20
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/users/getAllProducts`, { params: filters }),
          axios.get(`${process.env.REACT_APP_API_URL}/users/categories`)
        ]);

        setProducts(productsRes.data.products);
        setTotalPages(productsRes.data.totalPages);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
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
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : products.length === 0 ? (
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
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < 4 ? 'filled' : ''} />
                      ))}
                      <span>({product.reviews})</span>
                    </div>

                    <div className="price-container">
                      <span className="current-price">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="original-price">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button className="add-to-cart-button" onClick={() => addToCart(product)}>
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
              className={`pagination-item ${filters.page === page ? 'active' : ''}`}
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
