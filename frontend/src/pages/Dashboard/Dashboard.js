// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import HeroSection from "../../components/heroSection";
import HomeProducts from "../../components/featuredCollection";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import NewsletterSignup from "../../components/NewsletterSignup/NewsletterSignup";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Footer from "../../components/Footer/Footer";

const Dashboard = () => {
    // const { user, logout } = useAuth();

    return (
        <>
            <Header />
            <HeroSection />
            <FeaturedCategories />
            <HomeProducts />
            <WhyChooseUs />
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
