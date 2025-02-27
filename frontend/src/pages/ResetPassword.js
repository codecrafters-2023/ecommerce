import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';


const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const { token } = useParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            alert('Passwords do not match');
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
        <div className="register-container" style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)`,
             }}>
        <div className="auth-container"style={{background:"white"}} >
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