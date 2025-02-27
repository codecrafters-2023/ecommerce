import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/header';
import "./index.css"
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const { token } = useParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();


    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error('Password do not match');
            return;
        }

        if (!isValidPassword(password)) {
            toast.error('Password must be at least 8 characters long and include one uppercase letter, and one special character.');
            // alert('Password must be at least 10 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.');
            return;
        }

        try {
            const success = await resetPassword(token, password);
            if (success) navigate('/login');
        } catch (error) {
            // Error handled in auth context
        }
    };

    return (
        <div >
            <Header />
            <div className="resetPassword-container">
                <div className="resetPassword-box" style={{ background: "white" }} >
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                        </div>
                        <button className='form_button' type="submit">Reset Password</button>
                    </form>
                    <div className="auth-links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;