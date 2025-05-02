import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import api from "./utils/axiosConfig";
import "./App.css";
// import axios from "axios";

// ======Admin routes =====
import AdminRoute from "./Admin/components/AdminRoute";
import AdminOrders from "./Admin/pages/AdminOrders";
import CancelledOrders from "./Admin/pages/CancelledOrders";
import AdminDashboard from "./Admin/pages/AdminDashboard/AdminDashboard";
import AddProduct from "./Admin/pages/AddProduct";
import UsersList from "./Admin/pages/UsersList";
import ProductEditForm from "./Admin/components/ProductEditForm";
import ProductList from "./Admin/pages/Products";
import Settings from "./Admin/pages/Settings";
import Discounts from "./Admin/pages/Discounts";
import GalleryImageUpload from "./Admin/pages/GalleryImageUpload/GalleryImageUpload";


// ===============User routes ==================

import About from "./pages/About/about";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile/profile";
import AddressBook from "./components/AddressBook";
import OrderSuccess from "./components/order-success";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./components/RefundPolicy/RefundPolicy";
import ShippingPolicy from "./components/ShippingPolicy/ShippingPolicy";
import TermsOfServices from "./components/TermsOfServices/TermsOfServices";
import ContactInformation from "./components/ContactInformation/ContactInformation";
import Gallery from "./pages/Gallery/Gallery";


function App() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

//   useEffect(() => {
//     const validateCart = async () => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart`);
//                 if (data.coupon && data.items.length === 0) {
//                     await axios.post(`${process.env.REACT_APP_API_URL}/cart/reset`);
//                 }
//             } catch (error) {
//                 console.error('Cart validation failed:', error);
//             }
//         }
//     };
//     validateCart();
// }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* =============== User Routes ============== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/productDetail/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account/addresses" element={<AddressBook />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-of-services" element={<TermsOfServices />} />
            <Route path="/contact-information" element={<ContactInformation />} />
            <Route path="/gallery" element={<Gallery />} />

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
            </Route>
          </Routes>
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
