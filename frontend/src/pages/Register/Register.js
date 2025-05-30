import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './index.css';
import Header from '../../components/header';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        avatar: null,
    });



    const { register } = useAuth();
    // const navigate = useNavigate();

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            toast.error('Password do not match');
            return;
        }

        if (!isValidPassword(formData.password)) {
            toast.error('Password must be at least 8 characters long and include one uppercase letter, and one special character.');
            return;
        }

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('password', formData.password);
        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }

        try {
            await register(data);
            // toast.success('Verification codes sent to your email');

            // navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <Header />
            <div className="register-container">
                <div className="register-box">
                    <div className="register-left">
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
                        <h2>Create an Account</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <PhoneInput
                                    country={'us'}
                                    value={formData.phone}
                                    onChange={(phone, country) => {
                                        const fullNumber = `+${country.dialCode}${phone.replace(country.dialCode, '')}`;
                                        setFormData({ ...formData, phone: fullNumber });
                                    }}
                                    inputClass="phone-input"
                                    containerClass="phone-container"
                                    enableSearch
                                    countryCodeEditable={false}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="form-button" type="submit">Register</button>
                        </form>
                        <div className="auth-links">
                            <Link to="/login">Already have an account? Login</Link>
                        </div>
                    </div>
                    {/* <div className="register-right">
                    <img src={`${process.env.PUBLIC_URL}/register-Image.png`} alt="Register" className="register-image" />
                </div> */}
                </div>
            </div>

        </>
    );
};

export default Register;
