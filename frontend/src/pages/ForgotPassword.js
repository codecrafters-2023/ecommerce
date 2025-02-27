import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            navigate('/login');
        } catch (error) {
            // Error handled in auth context
        }
    };

    return (
        <div>
            <Header />
        <div className="register-container" style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg) `,
             }}>
        <div className="auth-container" style={{background: "white"}}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className='form_button' type="submit">Send Reset Link</button>
            </form>
            <div className="auth-links">
                <Link to="/login">Remember your password? Login</Link>
            </div>
            </div></div></div>
    );
};

export default ForgotPassword;