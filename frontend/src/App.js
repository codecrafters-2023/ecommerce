// import { useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AuthProvider } from "./context/AuthContext";
// import { CartProvider } from "./context/CartContext";
// import api from "./utils/axiosConfig";
// import "./App.css";
// // import axios from "axios";

// // ======Admin routes =====
// import AdminRoute from "./Admin/components/AdminRoute";
// import AdminOrders from "./Admin/pages/AdminOrders";
// import CancelledOrders from "./Admin/pages/CancelledOrders";
// import AdminDashboard from "./Admin/pages/AdminDashboard/AdminDashboard";
// import AddProduct from "./Admin/pages/AddProduct";
// import UsersList from "./Admin/pages/UsersList";
// import ProductEditForm from "./Admin/components/ProductEditForm";
// import ProductList from "./Admin/pages/Products";
// import Settings from "./Admin/pages/Settings";
// import Discounts from "./Admin/pages/Discounts";
// import GalleryImageUpload from "./Admin/pages/GalleryImageUpload/GalleryImageUpload";


// // ===============User routes ==================

// import About from "./pages/About/about";
// import Contact from "./pages/Contact/Contact";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import ProductDetail from "./pages/ProductDetail";
// import Checkout from "./pages/Checkout";
// import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
// import ResetPassword from "./pages/resetPassword/ResetPassword";
// import Shop from "./pages/Shop/Shop";
// import Cart from "./pages/Cart";
// import Profile from "./pages/Profile/profile";
// import AddressBook from "./components/AddressBook";
// import OrderSuccess from "./components/order-success";
// import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
// import RefundPolicy from "./components/RefundPolicy/RefundPolicy";
// import ShippingPolicy from "./components/ShippingPolicy/ShippingPolicy";
// import TermsOfServices from "./components/TermsOfServices/TermsOfServices";
// import ContactInformation from "./components/ContactInformation/ContactInformation";
// import Gallery from "./pages/Gallery/Gallery";
// import ScrollToTop from "./components/ScrollToTop";
// import AdminProfile from "./Admin/pages/Profile/Profile";
// import VerificationSuccess from "./components/verification-success";
// import GuestCartMerger from "./components/GuestCartMerger";


// function App() {

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//   }, []);

//   return (
//     <Router>
//       <ScrollToTop />
//       <AuthProvider>
//         <CartProvider>
//           <GuestCartMerger />
//           <Routes>
//             {/* =============== User Routes ============== */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password/:token" element={<ResetPassword />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/shop" element={<Shop />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/productDetail/:id" element={<ProductDetail />} />
//             <Route path="/checkout" element={<Checkout />} />
//             <Route path="/account/addresses" element={<AddressBook />} />
//             <Route path="/order-success" element={<OrderSuccess />} />
//             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//             <Route path="/refund-policy" element={<RefundPolicy />} />
//             <Route path="/shipping-policy" element={<ShippingPolicy />} />
//             <Route path="/terms-of-services" element={<TermsOfServices />} />
//             <Route path="/contact-information" element={<ContactInformation />} />
//             <Route path="/gallery" element={<Gallery />} />
//             <Route path="/verification-success" element={<VerificationSuccess />} />

//             {/* =============== Admin Routes ============== */}
//             <Route element={<AdminRoute />}>
//               <Route path="/admin" element={<AdminDashboard />} />
//               <Route path="/allProducts" element={<ProductList />} />
//               <Route path="/productEdit/:id" element={<ProductEditForm />} />
//               <Route path="/AddProduct" element={<AddProduct />} />
//               <Route path="/UsersList" element={<UsersList />} />
//               <Route path="/orders" element={<AdminOrders />} />
//               <Route path="/cancelorders" element={<CancelledOrders />} />
//               <Route path="/discounts" element={<Discounts />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/gallery-image-upload" element={<GalleryImageUpload />} />
//               <Route path="/admin-profile" element={<AdminProfile />} />
//             </Route>
//           </Routes>
//           <ToastContainer />
//         </CartProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import api from "./utils/axiosConfig";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";

// ====== Admin Components =====
const AdminRoute = lazy(() => import("./Admin/components/AdminRoute"));
const AdminDashboard = lazy(() => import("./Admin/pages/AdminDashboard/AdminDashboard"));
const AdminOrders = lazy(() => import("./Admin/pages/AdminOrders"));
const CancelledOrders = lazy(() => import("./Admin/pages/CancelledOrders"));
const AddProduct = lazy(() => import("./Admin/pages/AddProduct"));
const UsersList = lazy(() => import("./Admin/pages/UsersList"));
const ProductEditForm = lazy(() => import("./Admin/components/ProductEditForm"));
const ProductList = lazy(() => import("./Admin/pages/Products"));
const Settings = lazy(() => import("./Admin/pages/Settings"));
const Discounts = lazy(() => import("./Admin/pages/Discounts"));
const GalleryImageUpload = lazy(() => import("./Admin/pages/GalleryImageUpload/GalleryImageUpload"));
const AdminProfile = lazy(() => import("./Admin/pages/Profile/Profile"));

// ====== User Components =====
const About = lazy(() => import("./pages/About/about"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ForgotPassword = lazy(() => import("./pages/forgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/resetPassword/ResetPassword"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile/profile"));
const AddressBook = lazy(() => import("./components/AddressBook"));
const OrderSuccess = lazy(() => import("./components/order-success"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./components/RefundPolicy/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./components/ShippingPolicy/ShippingPolicy"));
const TermsOfServices = lazy(() => import("./components/TermsOfServices/TermsOfServices"));
const ContactInformation = lazy(() => import("./components/ContactInformation/ContactInformation"));
const Gallery = lazy(() => import("./pages/Gallery/Gallery"));
const VerificationSuccess = lazy(() => import("./components/verification-success"));
const GuestCartMerger = lazy(() => import("./components/GuestCartMerger"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <CartProvider>
            <GuestCartMerger />
            <ScrollToTop />
            <div className="App min-h-screen">
              <Routes>
                {/* =============== Public Routes ============== */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/productDetail/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/terms-of-services" element={<TermsOfServices />} />
                <Route path="/contact-information" element={<ContactInformation />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/verification-success" element={<VerificationSuccess />} />

                {/* =============== Protected User Routes ============== */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/account/addresses" element={<AddressBook />} />

                {/* =============== Admin Routes ============== */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/allProducts" element={<ProductList />} />
                  <Route path="/productEdit/:id" element={<ProductEditForm />} />
                  <Route path="/AddProduct" element={<AddProduct />} />
                  <Route path="/UsersList" element={<UsersList />} />
                  <Route path="/orders" element={<AdminOrders />} />
                  <Route path="/cancelorders" element={<CancelledOrders />} />
                  <Route path="/discounts" element={<Discounts />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/gallery-image-upload" element={<GalleryImageUpload />} />
                  <Route path="/admin-profile" element={<AdminProfile />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </CartProvider>
        </AuthProvider>
      </Suspense>
    </Router>
  );
}

export default App;