import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        if (!loading) {
            setIsCheckingAuth(false);
        }
    }, [loading]);

    if (isCheckingAuth) {
        return <div className="full-page-loader">Loading...</div>;
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;