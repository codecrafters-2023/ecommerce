// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import HeroSection from "../../components/heroSection";
import HomeProducts from "../../components/featuredCollection";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import NewsletterSignup from "../../components/NewsletterSignup/NewsletterSignup";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Footer from "../../components/Footer/Footer";
import TopSellingProduct from "../../components/TopSellingProduct/TopSellingProduct";

const Dashboard = () => {
    // const { user, logout } = useAuth();

    return (
        <>
            <Header />
            <HeroSection />
            {/* <FeaturedCategories /> */}
            <HomeProducts />
            <WhyChooseUs />
            {/* <TopSellingProduct /> */}
            <NewsletterSignup />
            <Footer />
            {/* <div className="dashboard">
                <h1>Welcome {user?.fullName || "User"}</h1> 
                <div className="user-info">
                    <p>Role: {user?.role}</p>
                    <button onClick={logout} className="logout-btn">
                        Logout
                    </button>
                </div>
                {user?.role === 'admin' && (
                    <div className="admin-links">
                        <h3>Admin Actions</h3>
                        <Link to="/admin">Go to Admin Panel</Link>
                    </div>
                )}
            </div> */}
        </>
    );
};

export default Dashboard;


// Home.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   ShoppingBag,
//   Truck,
//   Award,
//   Leaf,
//   Star,
//   ArrowRight,
//   Shield,
//   CheckCircle,
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   ChevronDown,
//   Zap,
//   BadgeCheck,
//   ShieldCheck,
//   PackageCheck,
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useCart } from '../../context/CartContext';

// // design assets (kept; but product images come from backend)
// // import turmericProduct from 'figma:asset/77a226d5ff3f7f43802843187423a2b89d8a6e95.png';
// // import logoImage from '../../../public/logo.png';

// export default function Home() {
//   // UI state (kept)
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [showHeader, setShowHeader] = useState(false);
//   const { addToCart, showNotification } = useCart();

//   // --- BACKEND STATES ---
//   const [latestProducts, setLatestProducts] = useState([]);
//   const [loadingLatest, setLoadingLatest] = useState(true);
//   const [latestError, setLatestError] = useState('');

//   const [topProduct, setTopProduct] = useState(null);
//   const [loadingTop, setLoadingTop] = useState(true);
//   const [topError, setTopError] = useState('');

//   // Fetch Latest Products
//   useEffect(() => {
//     let cancelled = false;
//     const fetchLatestProducts = async () => {
//       setLoadingLatest(true);
//       setLatestError('');
//       try {
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/products/getLatestProducts`);
//         const data = await res.json();
//         if (!cancelled) {
//           if (data && data.success) {
//             setLatestProducts(data.products || []);
//           } else if (Array.isArray(data)) {
//             setLatestProducts(data);
//           } else {
//             setLatestProducts([]);
//             setLatestError('No products returned from server.');
//           }
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error('Error fetching latest products:', err);
//           setLatestError(err.message || 'Failed to fetch latest products.');
//         }
//       } finally {
//         if (!cancelled) setLoadingLatest(false);
//       }
//     };

//     fetchLatestProducts();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Fetch Top Selling Product
//   useEffect(() => {
//     let cancelled = false;
//     const fetchTopProduct = async () => {
//       setLoadingTop(true);
//       setTopError('');
//       try {
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/users/top-selling`);
//         const data = await res.json();
//         if (!cancelled) {
//           if (data && data.product) setTopProduct(data.product);
//           else if (data && data._id) setTopProduct(data);
//           else if (Array.isArray(data) && data.length > 0) setTopProduct(data[0]);
//           else setTopProduct(data || null);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error('Error fetching top product:', err);
//           setTopError(err.message || 'Failed to fetch top-selling product.');
//         }
//       } finally {
//         if (!cancelled) setLoadingTop(false);
//       }
//     };

//     fetchTopProduct();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // --- keep your existing static data (testimonials, categories) ---
//   const categories = [
//     // { id: 1, name: 'Turmeric', image: turmericProduct, count: '12 Products' },
//     {
//       id: 2,
//       name: 'Spices',
//       image: 'https://images.unsplash.com/photo-1601379760561-dabddc5ff4cd?auto=format&fit=crop&w=1080&q=80',
//       count: '24 Products',
//     },
//     {
//       id: 3,
//       name: 'Herbs',
//       image: 'https://images.unsplash.com/photo-1607721098274-e54cbfab475d?auto=format&fit=crop&w=1080&q=80',
//       count: '18 Products',
//     },
//     {
//       id: 4,
//       name: 'Ginger',
//       image: 'https://images.unsplash.com/photo-1763019228611-b2bce31c89d5?auto=format&fit=crop&w=1080&q=80',
//       count: '8 Products',
//     },
//   ];

//   // huge testimonial list — kept as in original (truncated for brevity in this code block,
//   // but you have it in your original file; if you need full list re-add as needed)
//   const testimonials = [
//     { id: 1, name: 'Priya Sharma', location: 'Delhi', text: 'Good quality turmeric...', rating: 5 },
//     { id: 2, name: 'Rajesh Patel', location: 'Ahmedabad', text: 'Better than local stores...', rating: 4 },
//     // ...rest of testimonials (kept original set if you paste into your file)
//   ];

//   // scroll & testimonial navigation helpers (same as original)
//   useEffect(() => {
//     const handleScroll = () => {
//       const heroSection = document.getElementById('hero-section');
//       if (heroSection) {
//         const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
//         setShowHeader(window.scrollY > heroBottom - 100);
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollToNextSection = () => {
//     const exploreSection = document.getElementById('explore-section');
//     if (exploreSection) exploreSection.scrollIntoView({ behavior: 'smooth' });
//   };

//   const nextTestimonial = () => setCurrentTestimonial((p) => (p + 1) % testimonials.length);
//   const prevTestimonial = () => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length);

//   // handleAddToCart uses your cart context; we'll add an example payload
//   const handleAddToCart = (product) => {
//     try {
//       addToCart({
//         id: product?._id || 1,
//         name: product?.name || 'Premium Turmeric Powder',
//         price: product?.discountPrice || product?.price || 249,
//         count: 1,
//         image: product?.images?.[0]?.url ,
//       });
//     } catch (err) {
//       console.error('Add to cart error:', err);
//     }
//   };

//   // Natural Essentials -> choose first 3 backend products if available
//   const naturalEssentials = latestProducts.slice(0, 3);

//   // placeholder image fallback handler (inlined where used)
//   return (
//     <div className="overflow-hidden">
//       {/* Notification toast */}
//       {showNotification && (
//         <motion.div
//           initial={{ opacity: 0, y: -50, x: '-50%' }}
//           animate={{ opacity: 1, y: 0, x: '-50%' }}
//           exit={{ opacity: 0, y: -50, x: '-50%' }}
//           className="fixed top-24 left-1/2 z-50 bg-[#F3D35C] text-[#3B291A] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
//         >
//           <div className="w-12 h-12 rounded-full bg-[#3B291A]/10 flex items-center justify-center">
//             <CheckCircle className="w-6 h-6 text-[#3B291A]" />
//           </div>
//           <div>
//             <p className="font-bold text-lg">Added to Cart!</p>
//             <p className="text-sm text-[#3B291A]/80">Item added to cart</p>
//           </div>
//         </motion.div>
//       )}

//       {/* HERO SECTION */}
//       <section className="relative bg-white min-h-screen flex items-center" id="hero-section">
//         <motion.div
//           className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-30"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: [0, -4, 0], rotate: [0, 1, -1, 0] }}
//           transition={{ opacity: { duration: 0.8 }, y: { duration: 4, repeat: Infinity }, rotate: { duration: 6, repeat: Infinity } }}
//         >
//           <img src={process.env.PUBLIC_URL + '/logo.png'} alt="FarFoo" className="h-40 md:h-56 w-auto drop-shadow-2xl" />
//         </motion.div>

//         <div className="max-w-7xl mx-auto px-6 w-full">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             {/* Left */}
//             <div className="space-y-8">
//               <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-gray-100">
//                 <Sparkles className="w-4 h-4 text-[#F3D35C]" />
//                 <span className="text-[#3B291A] font-medium text-sm">Certified Quality Standards</span>
//               </div>

//               <div className="space-y-4">
//                 <h1 className="text-[#3B291A] leading-tight text-4xl md:text-5xl font-bold">
//                   Nature's Finest,<br />
//                   Delivered Pure
//                 </h1>
//                 <p className="text-xl text-[#3B291A] font-medium">FarFoo: Fresh Food from Farm to You</p>
//                 <p className="text-base text-[#3B291A]/70 leading-relaxed max-w-lg">
//                   Experience the authentic essence of nature with FarFoo's premium turmeric and spices, sourced directly from organic farms across India.
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
//                   <div className="w-9 h-9 rounded-lg bg-[#F3D35C] flex items-center justify-center">
//                     <CheckCircle className="w-5 h-5 text-[#3B291A]" />
//                   </div>
//                   <span className="text-[#3B291A] font-medium text-sm">Lab Tested</span>
//                 </div>
//                 <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
//                   <div className="w-9 h-9 rounded-lg bg-[#F3D35C] flex items-center justify-center">
//                     <Shield className="w-5 h-5 text-[#3B291A]" />
//                   </div>
//                   <span className="text-[#3B291A] font-medium text-sm">FSSAI Certified</span>
//                 </div>
//                 <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
//                   <div className="w-9 h-9 rounded-lg bg-[#F3D35C] flex items-center justify-center">
//                     <Truck className="w-5 h-5 text-[#3B291A]" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-[#3B291A] font-medium text-sm">Free Delivery*</span>
//                     <span className="text-[#3B291A]/60 text-xs">(On orders above ₹250)</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-4 pt-4">
//                 <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#4F8F3C] hover:bg-[#3d7330] text-white font-semibold shadow-lg hover:shadow-xl transition-all">
//                   <ShoppingBag className="w-5 h-5" />
//                   <span>Explore Products</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </Link>

//                 <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#3B291A] hover:bg-[#2a1e12] text-white font-semibold shadow-lg hover:shadow-xl transition-all">
//                   <span>Our Story</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </Link>
//               </div>
//             </div>

//             {/* Right - Showcase (converted to remain visual; product image replaced later by backend where needed) */}
//             <div className="relative">
//               {/* Glow layers */}
//               <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
//                 animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
//                 <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#F3D35C]/30 via-[#8CCB5E]/30 to-[#4F8F3C]/30 blur-3xl"></div>
//               </motion.div>

//               <motion.div className="relative z-10 cursor-pointer group" onClick={() => handleAddToCart({ name: 'Premium Turmeric Powder', price: 249, images: [{ url: process.env.PUBLIC_URL + '/farfoo.png' }] })} animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ willChange: 'transform' }}>
//                 <motion.img src={process.env.PUBLIC_URL + '/farfoo.png'} alt="Premium Turmeric Powder" className="w-full h-[500px] object-contain relative z-10" style={{ filter: 'drop-shadow(0 25px 50px rgba(243, 211, 92, 0.3))' }} whileHover={{ scale: 1.05, rotate: 5, transition: { duration: 0.3 } }} />
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         {/* Scroll down */}
//         <motion.button onClick={scrollToNextSection} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 group cursor-pointer" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
//           <div className="flex flex-col items-center gap-3">
//             <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#4F8F3C] to-transparent opacity-60"></div>
//             <div className="w-10 h-10 rounded-full border-2 border-[#4F8F3C] flex items-center justify-center group-hover:bg-[#4F8F3C] transition-all">
//               <ChevronDown className="w-5 h-5 text-[#4F8F3C] group-hover:text-white transition-colors" />
//             </div>
//           </div>
//         </motion.button>
//       </section>

//       {/* Our Natural Essentials (backend-driven first 3 products) */}
//       <section className="py-20 bg-[#FFF9E6]" id="explore-section">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16 space-y-4">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-[#F3D35C]/30">
//               <Sparkles className="w-4 h-4 text-[#F3D35C]" />
//               <span className="text-[#3B291A] font-semibold text-sm">Handpicked with Care</span>
//             </div>
//             <h2 className="font-['Poppins'] text-[#3B291A] text-3xl">Our Natural Essentials</h2>
//             <p className="text-base text-[#3B291A]/70 max-w-2xl mx-auto leading-relaxed">
//               Three pure products, cultivated with care from India's finest organic farms. Experience authentic flavor and unmatched quality in every spoonful.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//             {loadingLatest ? (
//               // show placeholders matching original structure
//               [0, 1, 2].map((i) => (
//                 <div key={i} className="group">
//                   <div className="relative h-full rounded-3xl bg-white shadow-lg animate-pulse" style={{ height: '100%' }} />
//                 </div>
//               ))
//             ) : (
//               naturalEssentials.map((product) => (
//                 <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="group">
//                   <div className="relative h-full rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#F3D35C]/30">
//                     <div className="absolute top-4 right-4 z-10">
//                       <div className="px-3 py-1.5 rounded-full bg-[#F3D35C] shadow-lg">
//                         <span className="text-[#3B291A] font-bold text-xs">Bestseller</span>
//                       </div>
//                     </div>

//                     <div className="relative pt-6 pb-4 px-6">
//                       <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative">
//                         <img
//                           src={product?.images?.[0]?.url}
//                           alt={product.name}
//                           className="relative w-full h-[240px] object-contain drop-shadow-2xl"
//                           onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
//                         />
//                       </motion.div>
//                     </div>

//                     <div className="p-6 pt-2 space-y-4">
//                       <div className="space-y-1">
//                         <h3 className="text-[#3B291A] font-bold text-2xl">{product.name}</h3>
//                         <div className="flex items-center gap-2">
//                           <Award className="w-3.5 h-3.5 text-[#4F8F3C]" />
//                           <span className="text-[#4F8F3C] font-medium text-xs">Lab Tested & Certified</span>
//                         </div>
//                       </div>

//                       <p className="text-[#3B291A]/70 text-sm leading-relaxed">
//                         {product.description ? product.description.slice(0, 120) + (product.description.length > 120 ? '...' : '') : 'High quality product sourced responsibly.'}
//                       </p>

//                       <div className="flex flex-wrap gap-2">
//                         <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4F8F3C]/10 border border-[#4F8F3C]/20">
//                           <CheckCircle className="w-3 h-3 text-[#4F8F3C]" />
//                           <span className="text-[#3B291A] text-xs font-medium">Naturally Sourced</span>
//                         </div>
//                         <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4F8F3C]/10 border border-[#4F8F3C]/20">
//                           <CheckCircle className="w-3 h-3 text-[#4F8F3C]" />
//                           <span className="text-[#3B291A] text-xs font-medium">No Added Colors</span>
//                         </div>
//                         <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4F8F3C]/10 border border-[#4F8F3C]/20">
//                           <CheckCircle className="w-3 h-3 text-[#4F8F3C]" />
//                           <span className="text-[#3B291A] text-xs font-medium">FSSAI Certified</span>
//                         </div>
//                       </div>

//                       <div className="pt-2 flex items-end justify-between">
//                         <div>
//                           <p className="text-[#3B291A]/60 text-xs">Starting from</p>
//                           <p className="text-[#3B291A] font-bold text-xl">₹{product.discountPrice || product.price}</p>
//                         </div>
//                         <div className="flex gap-2 items-center">
//                           <button onClick={() => handleAddToCart(product)} className="px-4 py-2 rounded-full bg-[#F3D35C] text-[#3B291A] font-semibold">Add</button>
//                           <Link to={`/productDetail/${product._id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F8F3C] text-white font-semibold shadow-lg">Shop</Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))
//             )}
//           </div>

//           {/* Bottom Trust Bar */}
//           <div className="mt-16 flex flex-wrap justify-center items-center gap-12">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-2xl bg-[#4F8F3C] flex items-center justify-center">
//                 <Truck className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <p className="text-[#3B291A] font-bold text-sm">Free Delivery*</p>
//                 <p className="text-[#3B291A]/60 text-xs">On orders above ₹250</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-2xl bg-[#4F8F3C] flex items-center justify-center">
//                 <Award className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <p className="text-[#3B291A] font-bold text-sm">Lab Tested</p>
//                 <p className="text-[#3B291A]/60 text-xs">Quality checked every batch</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-2xl bg-[#4F8F3C] flex items-center justify-center">
//                 <Leaf className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <p className="text-[#3B291A] font-bold text-sm">Naturally Sourced</p>
//                 <p className="text-[#3B291A]/60 text-xs">From trusted organic farms</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Product (Top Selling) - backend */}
//       <section className="py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-[#3B291A] mb-6">Featured Product</h2>

//           {loadingTop ? (
//             <div className="p-6 bg-white rounded-xl shadow">Loading featured product...</div>
//           ) : topError ? (
//             <div className="p-6 bg-red-50 rounded-xl text-red-700">Error: {topError}</div>
//           ) : !topProduct ? (
//             <div className="p-6 bg-yellow-50 rounded-xl">No featured product found</div>
//           ) : (
//             <div className="flex flex-col md:flex-row gap-8 items-center bg-[#FFF9E6] p-8 rounded-2xl shadow-lg">
//               <div className="w-full md:w-1/3">
//                 <img
//                   src={topProduct.images?.[0]?.url}
//                   alt={topProduct.name}
//                   className="w-full h-64 object-contain"
//                   onError={(e) => (e.target.src = '/images/placeholder.jpg')}
//                 />
//               </div>

//               <div className="flex-1 space-y-4">
//                 <h3 className="text-2xl font-bold text-[#3B291A]">{topProduct.name}</h3>

//                 <div className="flex items-center gap-4">
//                   {topProduct.discountPrice ? (
//                     <>
//                       <span className="line-through text-gray-500">₹{topProduct.price}</span>
//                       <span className="text-[#4F8F3C] font-bold">₹{topProduct.discountPrice}</span>
//                     </>
//                   ) : (
//                     <span className="text-lg font-bold">₹{topProduct.price}</span>
//                   )}
//                 </div>

//                 <p className="text-[#3B291A]/70">{topProduct.description}</p>

//                 <div className="flex items-center gap-4">
//                   <Link to={`/productDetail/${topProduct._id}`} className="px-6 py-3 bg-[#4F8F3C] text-white rounded-full font-semibold">View Details</Link>
//                   <button onClick={() => handleAddToCart(topProduct)} className="px-6 py-3 bg-[#F3D35C] text-[#3B291A] rounded-full font-semibold">Add to Cart</button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Latest Products (backend) */}
//       {/* <section className="py-12 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-3xl font-bold text-[#3B291A]">Our Products</h2>
//             <Link to="/shop" className="text-sm font-semibold text-[#4F8F3C]">Explore All Products →</Link>
//           </div>

//           {loadingLatest ? (
//             <div className="p-6 bg-white rounded-xl shadow">Loading products...</div>
//           ) : latestError ? (
//             <div className="p-6 bg-red-50 rounded-xl text-red-700">Error: {latestError}</div>
//           ) : latestProducts.length === 0 ? (
//             <div className="p-6 bg-yellow-50 rounded-xl">No products found</div>
//           ) : (
//             <div className="grid md:grid-cols-3 gap-6">
//               {latestProducts.map((product) => (
//                 <Link to={`/productDetail/${product._id}`} key={product._id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
//                   <div className="h-48 flex items-center justify-center mb-4">
//                     <img src={product.images?.[0]?.url} alt={product.name} className="max-h-44 object-contain" onError={(e) => (e.target.src = '/images/placeholder.jpg')} />
//                   </div>
//                   <h3 className="font-semibold text-[#3B291A]">{product.name}</h3>
//                   <div className="mt-2">
//                     {product.discountPrice ? (
//                       <>
//                         <span className="line-through text-gray-500 mr-2">₹{product.price}</span>
//                         <span className="font-bold text-[#4F8F3C]">₹{product.discountPrice}</span>
//                       </>
//                     ) : (
//                       <span className="font-bold">₹{product.price}</span>
//                     )}
//                   </div>
//                   <div className="mt-3 flex gap-2">
//                     <button onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} className="px-4 py-2 rounded-full bg-[#F3D35C] text-[#3B291A] font-semibold">Add</button>
//                     <Link to={`/productDetail/${product._id}`} className="px-4 py-2 rounded-full bg-[#4F8F3C] text-white font-semibold">View</Link>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section> */}

//       {/* Why Choose Us (kept) */}
//       <section className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3D35C]/10 border border-[#F3D35C]/30 mb-4">
//               <Sparkles className="w-4 h-4 text-[#F3D35C]" />
//               <span className="text-[#3B291A] font-semibold text-sm">The FarFoo Advantage</span>
//             </div>
//             <h2 className="font-['Poppins'] text-[#3B291A] text-4xl mb-4">Why Choose FarFoo</h2>
//             <p className="text-[#3B291A]/60 text-base max-w-2xl mx-auto leading-relaxed">Premium quality, trusted partners, and hassle-free experience - that's our promise to you</p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="group">
//               <div className="relative h-full p-6 rounded-2xl bg-white hover:bg-[#FFF9E6] transition-all duration-300 border border-gray-100 hover:border-[#F3D35C]/40 hover:shadow-xl overflow-hidden">
//                 <div className="relative z-10 text-center space-y-4">
//                   <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#F3D35C] to-[#D4A75B] shadow-lg" whileHover={{ scale: 1.1, rotate: 5 }} animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}>
//                     <Zap className="w-8 h-8 text-white" />
//                   </motion.div>
//                   <h3 className="text-[#3B291A] text-lg font-semibold">Express Delivery</h3>
//                   <p className="text-[#3B291A]/60 text-sm leading-relaxed">Quick delivery in 3-5 business days across India</p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="group">
//               <div className="relative h-full p-6 rounded-2xl bg-white hover:bg-[#FFF9E6] transition-all duration-300 border border-gray-100 hover:border-[#4F8F3C]/40 hover:shadow-xl overflow-hidden">
//                 <div className="relative z-10 text-center space-y-4">
//                   <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F8F3C] to-[#8CCB5E] shadow-lg" whileHover={{ scale: 1.1, rotate: -5 }} animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 } }}>
//                     <BadgeCheck className="w-8 h-8 text-white" />
//                   </motion.div>
//                   <h3 className="text-[#3B291A] text-lg font-semibold">FSSAI Certified</h3>
//                   <p className="text-[#3B291A]/60 text-sm leading-relaxed">Every product is lab tested and meets highest food safety standards</p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="group">
//               <div className="relative h-full p-6 rounded-2xl bg-white hover:bg-[#FFF9E6] transition-all duration-300 border border-gray-100 hover:border-[#D4A75B]/40 hover:shadow-xl overflow-hidden">
//                 <div className="relative z-10 text-center space-y-4">
//                   <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#D4A75B] to-[#F3D35C] shadow-lg" whileHover={{ scale: 1.1, rotate: 5 }} animate={{ y: [0, -8, 0] }} transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 } }}>
//                     <ShieldCheck className="w-8 h-8 text-white" />
//                   </motion.div>
//                   <h3 className="text-[#3B291A] text-lg font-semibold">Secure Payments</h3>
//                   <p className="text-[#3B291A]/60 text-sm leading-relaxed">100% safe & encrypted transactions with multiple payment options</p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="group">
//               <div className="relative h-full p-6 rounded-2xl bg-white hover:bg-[#FFF9E6] transition-all duration-300 border border-gray-100 hover:border-[#8CCB5E]/40 hover:shadow-xl overflow-hidden">
//                 <div className="relative z-10 text-center space-y-4">
//                   <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#8CCB5E] to-[#4F8F3C] shadow-lg">
//                     <PackageCheck className="w-8 h-8 text-white" />
//                   </motion.div>
//                   <h3 className="text-[#3B291A] text-lg font-semibold">Easy Returns</h3>
//                   <p className="text-[#3B291A]/60 text-sm leading-relaxed">7-day hassle-free return policy</p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="relative">
//             <div className="overflow-hidden">
//               <div className="transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
//                 <div className="flex">
//                   {testimonials.map((testimonial) => (
//                     <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
//                       <div className="max-w-4xl mx-auto">
//                         <div className="relative p-8 rounded-3xl bg-white shadow-xl border border-[#F3D35C]/20">
//                           <div className="absolute top-4 right-6 text-6xl text-[#F3D35C]/20 font-serif leading-none">"</div>
//                           <div className="relative">
//                             <div className="text-center space-y-4">
//                               <div className="flex gap-1 justify-center">
//                                 {Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-[#F3D35C] text-[#F3D35C]" />)}
//                               </div>
//                               <p className="text-[#3B291A] text-lg leading-relaxed italic font-light max-w-2xl mx-auto">{testimonial.text}</p>
//                               <div className="pt-2">
//                                 <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#4F8F3C]/10 to-[#8CCB5E]/10 border border-[#4F8F3C]/20">
//                                   <CheckCircle className="w-4 h-4 text-[#4F8F3C]" />
//                                   <div className="text-left">
//                                     <p className="text-[#3B291A] font-bold text-base">{testimonial.name}</p>
//                                     <p className="text-[#4F8F3C] font-medium text-xs">{testimonial.location}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <button onClick={prevTestimonial} className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#4F8F3C] hover:bg-[#3d7330] text-white shadow-xl flex items-center justify-center -translate-x-1/2">
//               <ChevronLeft className="w-6 h-6" />
//             </button>
//             <button onClick={nextTestimonial} className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#4F8F3C] hover:bg-[#3d7330] text-white shadow-xl flex items-center justify-center translate-x-1/2">
//               <ChevronRight className="w-6 h-6" />
//             </button>

//             <div className="mt-8 flex justify-center">
//               <div className="w-64 h-1.5 bg-[#3B291A]/10 rounded-full overflow-hidden">
//                 <div className="h-full bg-gradient-to-r from-[#4F8F3C] to-[#8CCB5E] transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentTestimonial + 1) / testimonials.length) * 100}%` }} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Subscribe */}
//       <section className="py-20 bg-[#FFF9E6]">
//         <div className="max-w-4xl mx-auto px-6">
//           <div className="bg-white rounded-[40px] p-12 shadow-xl border border-[#F3D35C]/20">
//             <div className="text-center mb-10">
//               <div className="inline-block px-5 py-2 rounded-full bg-white/90 mb-6">
//                 <span className="text-[#3B291A]/80">✉️ Stay Connected</span>
//               </div>
//               <h2 className="font-['Poppins'] text-[#3B291A] text-4xl mb-4">Get Exclusive Offers & Updates</h2>
//               <p className="text-[#3B291A]/70 text-lg max-w-xl mx-auto">Join our community and be the first to know about new products and special deals.</p>
//             </div>

//             <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
//               <input type="email" placeholder="Enter your email address" className="flex-1 px-7 py-4 rounded-full border-none bg-white/95 backdrop-blur-md focus:bg-white outline-none transition-all text-[#3B291A] placeholder:text-[#3B291A]/40 shadow-lg" />
//               <button type="submit" className="px-10 py-4 rounded-full bg-[#3B291A] hover:bg-[#3B291A]/90 text-white font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap">Subscribe Now</button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
