import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// ======Admin routes =====
import AdminRoute from "./Admin/components/AdminRoute";
import AdminPanel from "./Admin/pages/AdminPanel/AdminPanel";

// ======User routes =====
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Carts";
import Domains from "./Admin/pages/Domains/Domains";
import Profile from "./pages/Profile/profile";

// ===============Public routes ==================
import "./App.css";
import About from "./pages/About/about";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
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

            {/* =============== User Routes ============== */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} /> {/* ✅ Profile Route */}

            {/* =============== Admin Routes ============== */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
            <Route path="/domains" element={<Domains />} />
          </Routes>
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
