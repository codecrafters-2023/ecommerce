import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import api from "./utils/axiosConfig";

// ======Admin routes =====
import AdminRoute from "./Admin/components/AdminRoute";
import AdminOrders from "./Admin/pages/AdminOrders";
import CancelledOrders from "./Admin/pages/CancelledOrders";
import AdminDashboard from "./Admin/pages/AdminDashboard/AdminDashboard";
import AddProduct from "./Admin/pages/AddProduct";
import UsersList from "./Admin/pages/UsersList";
import ProductEditForm from "./Admin/components/ProductEditForm";
import ProductList from "./Admin/pages/Products";


// ======User routes =====
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile/profile";


// ===============Public routes ==================
import "./App.css";
import About from "./pages/About/about";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import { useEffect } from "react";
import Checkout from "./pages/Checkout";
import AddressBook from "./components/AddressBook";
import OrderSuccess from "./components/order-success";
import Settings from "./Admin/pages/Settings";
import Discounts from "./Admin/pages/Discounts";


function App() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/productDetail/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account/addresses" element={<AddressBook />} />
            <Route path="/order-success" element={<OrderSuccess />} />

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
            </Route>
          </Routes>
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
