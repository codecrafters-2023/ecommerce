// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './index.css';
// import Header from '../../components/header'
// import { FiShoppingCart, FiSearch, FiGrid, FiList } from 'react-icons/fi';
// import { Link, useSearchParams } from 'react-router-dom';
// import { useCart } from '../../context/CartContext'
// import Footer from '../../components/Footer/Footer';

// const ProductListPage = () => {
//   const [searchParams] = useSearchParams();
//   const initialCategory = searchParams.get('category') || '';
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [tempFilters, setTempFilters] = useState({
//     search: '',
//     category: '',
//     minPrice: '',
//     maxPrice: '',
//     sort: 'newest',
//     page: 1,
//     limit: 20
//   });
//   const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });
//   const [totalPages, setTotalPages] = useState(1);
//   const [viewMode, setViewMode] = useState('grid');
//   const [showViewOptions, setShowViewOptions] = useState(false);

//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProductsAndCategories = async () => {
//       try {
//         const [productsRes, categoriesRes] = await Promise.all([
//           axios.get(`${process.env.REACT_APP_API_URL}/users/getAllProducts`, {
//             params: {
//               ...appliedFilters,
//               page: appliedFilters.page,
//               limit: appliedFilters.limit
//             }
//           }),
//           axios.get(`${process.env.REACT_APP_API_URL}/users/categories`)
//         ]);

//         setProducts(productsRes.data.products);
//         setTotalPages(productsRes.data.totalPages);
//         setCategories(categoriesRes.data.categories);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchProductsAndCategories();
//   }, [appliedFilters]);

//   useEffect(() => {
//     // Update filters when category URL param changes
//     setTempFilters(prev => ({
//       ...prev,
//       category: initialCategory
//     }));
//     setAppliedFilters(prev => ({
//       ...prev,
//       category: initialCategory,
//       page: 1
//     }));
//   }, [initialCategory]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setTempFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const applyFilters = () => {
//     setAppliedFilters({
//       ...tempFilters,
//       page: 1
//     });
//   };

//   const clearFilters = () => {
//     const resetFilters = {
//       search: '',
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       sort: 'newest',
//       page: 1,
//       limit: 20
//     };
//     setTempFilters(resetFilters);
//     setAppliedFilters(resetFilters);
//   };

//   const handlePageChange = (newPage) => {
//     setAppliedFilters(prev => ({ ...prev, page: newPage }));
//   };


//   return (
//     <>
//       <Header />
//       <div className="product-list-container">
//         {/* Search and Filters Section */}
//         <div className="product-list-header">
//           <div className="search-container">
//             <FiSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               name="search"
//               value={tempFilters.search}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div className="filters-container">

//             <div className="filter-group">
//               <select
//                 name="category"
//                 value={tempFilters.category}
//                 onChange={handleFilterChange}
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-group">
//               <select
//                 name="sort"
//                 value={tempFilters.sort}
//                 onChange={handleFilterChange}
//               >
//                 <option value="newest">New Arrivals</option>
//                 <option value="price-asc">Price: Low to High</option>
//                 <option value="price-desc">Price: High to Low</option>
//                 <option value="popular">Most Popular</option>
//               </select>
//             </div>

//             <div className="view-selector">
//               <div
//                 className="view-selector-header"
//                 onClick={() => setShowViewOptions(!showViewOptions)}
//               >
//                 {viewMode === 'grid' ? <FiGrid /> : <FiList />}
//                 <span>{viewMode === 'grid' ? 'Grid View' : 'List View'}</span>
//               </div>

//               {showViewOptions && (
//                 <div className="view-options">
//                   <div
//                     className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
//                     onClick={() => {
//                       setViewMode('grid');
//                       setShowViewOptions(false);
//                     }}
//                   >
//                     <FiGrid />
//                     <span>Grid View</span>
//                   </div>
//                   <div
//                     className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
//                     onClick={() => {
//                       setViewMode('list');
//                       setShowViewOptions(false);
//                     }}
//                   >
//                     <FiList />
//                     <span>List View</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="limit-selector">
//               <select
//                 value={tempFilters.limit}
//                 name="limit"
//                 onChange={handleFilterChange}
//               >
//                 <option value="12">12 Products</option>
//                 <option value="24">24 Products</option>
//                 <option value="36">36 Products</option>
//               </select>
//             </div>


//             {/* Add Filter Buttons Here */}
//             <div className="filter-buttons">
//               <button
//                 type="button"
//                 className="apply-filters"
//                 onClick={applyFilters}
//               >
//                 Apply Filters
//               </button>
//               <button
//                 type="button"
//                 className="clear-filters"
//                 onClick={clearFilters}
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="product-list-main">
//           {/* Price Filter Sidebar */}
//           <div className="price-filter-sidebar">
//             <h3>Price Range</h3>
//             <div className="price-inputs">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 name="minPrice"
//                 value={tempFilters.minPrice}
//                 onChange={handleFilterChange}
//               />
//               <span>-</span>
//               <input
//                 type="number"
//                 placeholder="Max"
//                 name="maxPrice"
//                 value={tempFilters.maxPrice}
//                 onChange={handleFilterChange}
//               />
//             </div>
//           </div>


//           {/* Product Grid */}
//           <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
//             {products.length === 0 ? (
//               <div className="no-results">
//                 <h2>No products found</h2>
//                 <p>Try adjusting your search filters</p>
//               </div>
//             ) : (
//               products.map(product => (
//                 <div key={product._id} className="product-card">
//                   <div className="product-image-container">
//                     <Link to={`/productDetail/${product._id}`}>
//                       <img
//                         src={product.images[0]?.url}
//                         alt={product.name}
//                       />
//                     </Link>
//                     {/* <button className="quick-view-button">
//                       uick View
//                     </button> */}
//                   </div>

//                   <div className="product-details">
//                     <h3 className="product-brand">{product.brand}</h3>
//                     <h3 className="product-title">{product.name}</h3>
//                     {/* <div className="product-rating">
//                       {[...Array(5)].map((_, i) => (
//                         <FiStar key={i} className={i < 4 ? 'filled' : ''} />
//                       ))}
//                       <span>({product.reviews})</span>
//                     </div> */}

//                     <div className="price-container">
//                       <span className="current-price">
//                         ₹{product.discountPrice}
//                       </span>
//                       {product.price && (
//                         <span className="original-price">
//                           ₹{product.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* <button
//                       className="add-to-cart-button"
//                       onClick={() => addToCart(product._id)}
//                     >
//                       <FiShoppingCart />
//                       Add to Cart
//                     </button> */}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="modern-pagination">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//             <button
//               key={page}
//               className={`pagination-item ${tempFilters.page === page ? 'active' : ''}`}
//               onClick={() => handlePageChange(page)}
//             >
//               {page}
//             </button>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductListPage;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Shop.css';
import Header from '../../components/header';
import { ShoppingBag, Star, BadgeCheck, Leaf, Award, Package } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Footer/Footer';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/users/getAllProducts`, {
            params: {
              ...filters,
              page: filters.page,
              limit: filters.limit
            }
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
  }, [filters]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: initialCategory,
      page: 1
    }));
  }, [initialCategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Static product data for demo (similar to Shop.tsx)
  const demoProducts = [
    {
      id: 1,
      name: 'Premium Turmeric Powder',
      description: 'Naturally sourced golden turmeric from Punjab farms',
      price: 249,
      originalPrice: 299,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1623822221576-65d0dd06a304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHNwaWNlc3xlbnwxfHx8fDE3NjU0MTExMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      weight: '250g',
      discount: 17,
      badges: ['Bestseller', 'FSSAI Certified', 'Lab Tested'],
      benefits: ['No Added Colors', 'No Preservatives', 'Farm Fresh'],
    },
    {
      id: 2,
      name: 'Red Chili Powder',
      description: 'Authentic spicy red chili powder with rich color',
      price: 179,
      originalPrice: 219,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1738680981649-3f81bdfe225d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBtYXJrZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjU0MTEyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      weight: '200g',
      discount: 18,
      badges: ['Lab Tested', 'FSSAI Certified'],
      benefits: ['High Pungency', 'Natural Color', 'No Additives'],
    },
    {
      id: 3,
      name: 'Coriander Powder',
      description: 'Aromatic coriander powder for authentic Indian flavors',
      price: 149,
      originalPrice: 189,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1626795455331-10c6d3a8a632?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JpYW5kZXIlMjBzcGljZXN8ZW58MXx8fHwxNzY1NDU2NDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      weight: '200g',
      discount: 21,
      badges: ['New Arrival', 'FSSAI Certified'],
      benefits: ['Fresh Ground', 'Rich Aroma', 'Quality Assured'],
    },
  ];

  const comingSoonProducts = [
    {
      id: 1,
      name: 'Green Cardamom',
      image: 'https://images.unsplash.com/photo-1623307645781-90cd6ee11dc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYW1vbSUyMHNwaWNlfGVufDF8fHx8MTc2NTQ1NjQ1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Aromatic premium cardamom',
    },
    {
      id: 2,
      name: 'Black Pepper',
      image: 'https://images.unsplash.com/photo-1649951806971-ad0e00408773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlfGVufDF8fHx8MTc2NTQ1NjQ0OXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Fresh ground peppercorns',
    },
    {
      id: 3,
      name: 'Cumin Seeds',
      image: 'https://images.unsplash.com/photo-1600791102844-208e695205f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzJTIwc3BpY2V8ZW58MXx8fHwxNzY1NDExMTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Rich, earthy cumin',
    },
  ];

  // Use API products or demo products if none available
  const displayProducts = products.length > 0 ? products.map(product => ({
    ...product,
    name: product.name || 'Product',
    description: product.description || 'High quality product',
    price: product.discountPrice || product.price || 0,
    originalPrice: product.price || 0,
    rating: 4.5,
    reviews: 0,
    image: product.images?.[0]?.url || demoProducts[0].image,
    weight: product.weight || '250g',
    discount: product.discount || 0,
    badges: product.badges || ['FSSAI Certified'],
    benefits: ['Farm Fresh', 'Quality Assured', 'Natural']
  })) : demoProducts;

  return (
    <>
      <Header />
      <div className="shop-container">
        {/* Hero Section */}
        <div className="shop-hero">
          <div className="hero-decorative-1"></div>
          <div className="hero-decorative-2"></div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <Leaf className="badge-icon" />
              <span className="badge-text">Farm to Kitchen Excellence</span>
            </div>
            
            <h1 className="hero-title">Our Premium Collection</h1>
            <p className="hero-subtitle">
              Handpicked spices from Punjab's finest farms. Quality assured, lab tested, and FSSAI certified.
            </p>
          </div>

          {/* Stats Section */}
          <div className="shop-stats">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Award className="stat-icon" />
              </div>
              <p className="stat-label">FSSAI Certified</p>
              <p className="stat-value">100%</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <BadgeCheck className="stat-icon" />
              </div>
              <p className="stat-label">Lab Tested</p>
              <p className="stat-value">Every Batch</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Leaf className="stat-icon" />
              </div>
              <p className="stat-label">Farm Fresh</p>
              <p className="stat-value">Direct Source</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Package className="stat-icon" />
              </div>
              <p className="stat-label">Safe Packaging</p>
              <p className="stat-value">Sealed</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {/* <div className="shop-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
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
                className="filter-select"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="filter-group price-filter">
              <input
                type="number"
                placeholder="Min"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="price-input"
              />
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div> */}

        {/* Products Section */}
        <div className="shop-products">
          <div className="products-grid">
            {displayProducts.map((product, index) => (
              <div
                key={product._id || product.id}
                className="product-card"
                onMouseEnter={() => setHoveredProduct(product._id || product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Link to={`/productDetail/${product._id || product.id}`}>
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    
                    {/* Badges */}
                    <div className="product-badges">
                      {product.badges.slice(0, 1).map((badge, i) => (
                        <span key={i} className="product-badge">
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="discount-badge">
                        {product.discount}% OFF
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className={`product-overlay ${hoveredProduct === (product._id || product.id) ? 'visible' : ''}`}>
                      <div className="overlay-content">
                        <div className="product-benefits">
                          {product.benefits.map((benefit, i) => (
                            <span key={i} className="benefit-tag">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="product-content">
                    {/* Rating */}
                    <div className="product-rating">
                      <div className="rating-stars">
                        <Star className="star-icon" />
                        <span className="rating-value">{product.rating}</span>
                      </div>
                      <span className="rating-count">({product.reviews} reviews)</span>
                      <BadgeCheck className="certified-icon" />
                    </div>

                    {/* Product Name */}
                    <h3 className="product-name">{product.name}</h3>
                    
                    {/* Description */}
                    <p className="product-description">{product.description}</p>

                    {/* Weight */}
                    <div className="product-weight">
                      <Package className="weight-icon" />
                      <span>{product.weight}</span>
                    </div>

                    {/* Divider */}
                    <div className="product-divider"></div>

                    {/* Price & CTA */}
                    <div className="product-price-section">
                      <div className="price-container">
                        <span className="current-price">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <p className="delivery-text">Free delivery available</p>
                    </div>

                    {/* Add to Cart Button */}
                    {/* <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product._id || product.id);
                      }}
                    >
                      <ShoppingBag className="cart-icon" />
                      <span>Add to Cart</span>
                    </button> */}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shop-pagination">
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
          )}
        </div>

        {/* Trust Section */}
        <div className="trust-section">
          <div className="trust-content">
            <h3 className="trust-title">Why Choose FarFoo?</h3>
            <div className="trust-points">
              <div className="trust-point">
                <div className="trust-icon-wrapper">
                  <Leaf className="trust-icon" />
                </div>
                <h4 className="point-title">Naturally Sourced</h4>
                <p className="point-description">Direct from Punjab farms with no artificial additives</p>
              </div>
              <div className="trust-point">
                <div className="trust-icon-wrapper">
                  <BadgeCheck className="trust-icon" />
                </div>
                <h4 className="point-title">Quality Assured</h4>
                <p className="point-description">Every batch is lab tested and FSSAI certified</p>
              </div>
              <div className="trust-point">
                <div className="trust-icon-wrapper">
                  <Award className="trust-icon" />
                </div>
                <h4 className="point-title">Customer Trusted</h4>
                <p className="point-description">Join 500+ happy families enjoying pure flavors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="coming-soon-section">
          <div className="coming-soon-header">
            <div className="coming-soon-badge">
              <Leaf className="badge-icon" />
              <span className="badge-text">Coming Soon</span>
            </div>
            <h3 className="coming-soon-title">More Premium Spices</h3>
            <p className="coming-soon-subtitle">
              We're expanding our collection with more farm-fresh spices. Be the first to know when they launch!
            </p>
          </div>

          <div className="coming-soon-grid">
            {comingSoonProducts.map((product, index) => (
              <div key={product.id} className="coming-soon-card">
                <div className="coming-soon-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-preview-image"
                  />
                  <div className="coming-soon-badge-overlay">
                    <span className="coming-soon-tag">Coming Soon</span>
                  </div>
                </div>
                <div className="coming-soon-content">
                  <h4 className="coming-soon-product-name">{product.name}</h4>
                  <p className="coming-soon-product-description">{product.description}</p>
                  <button className="notify-me-btn">
                    <BadgeCheck className="notify-icon" />
                    <span>Notify Me</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
