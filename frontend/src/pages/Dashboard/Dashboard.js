import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <Header />
            {/* <Hero /> */}
            <div className="dashboard">
                <h1>Welcome {user?.fullName || "User"}</h1>  {/* Fallback if name is missing */}
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
            </div>
        </>
    );
};

export default Dashboard;
