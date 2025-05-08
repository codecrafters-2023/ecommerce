import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('/login'), 3000);
    }, []);

    return (
        <div className="container text-center mt-5">
            <h2>Email Verified Successfully! ✅</h2>
            <p>Redirecting to login page...</p>
        </div>
    );
};

export default VerificationSuccess;