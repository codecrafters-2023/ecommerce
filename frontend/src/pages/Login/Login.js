// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import Header from '../../components/header';

// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await login(formData);
//             // navigate('/');
//         } catch (error) {
//             // Error handled in auth context
//         }
//     };

//     return (

//         <div
//             className="min-h-screen flex flex-col bg-cover bg-center"
//             style={{ backgroundImage: "url('/bg.jpg')" }} // ✅ Add Background Image
//         >            {/* ✅ Fixed Header Placement */}
//             <Header />

//             {/* ✅ Centered Login Form */}
//             <div className="flex flex-1 justify-center items-center">
//                 <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
//                     <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back 👋</h2>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <label className="block text-gray-600 font-medium">Email</label>
//                             <input
//                                 type="email"
//                                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                                 value={formData.email}
//                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-600 font-medium">Password</label>
//                             <input
//                                 type="password"
//                                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                                 value={formData.password}
//                                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                 required
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full bg-green-700 hover:bg-green-700 text-white font-bold py-2  transition-all"
//                         >
//                             Login
//                         </button>
//                     </form>

//                     <div className="text-center mt-4 text-gray-600">
//                         <Link to="/forgot-password" className="hover:text-blue-500">Forgot Password?</Link>
//                     </div>

//                     <div className="text-center mt-2 text-gray-600">
//                         New here? <Link to="/register" className="text-blue-500 font-medium hover:underline">Create Account</Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;




import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Phone, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';

const Login = () => {
    const { login, register, isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    // Login form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Signup form data
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        avatar: null,
    });

    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn && user) {
            // Redirect admin users to admin dashboard
            if (user.isAdmin) {
                navigate('/admin');
            } else {
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from);
            }
        }
    }, [isLoggedIn, user, navigate, location]);

    const handleLoginInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (loginError) {
            setLoginError('');
        }
    };

    const handleSignupInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!loginData.password.trim()) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignup = () => {
        const newErrors = {};
        if (!signupData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!signupData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!signupData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!signupData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(signupData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!signupData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (signupData.password.length < 10) {
            newErrors.password = 'Password must be at least 10 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(signupData.password)) {
            newErrors.password = 'Password must include uppercase, lowercase, and special character';
        }
        if (!signupData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (signupData.password !== signupData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateLogin()) {
            try {
                await login(loginData);
                // Navigation is handled by useEffect above
            } catch (error) {
                setLoginError('Invalid email or password. Try user@example.com / password or admin@farfoo.com / admin123');
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateSignup()) {
            const data = new FormData();
            data.append('fullName', `${signupData.firstName} ${signupData.lastName}`);
            data.append('email', signupData.email);
            data.append('phone', `+91${signupData.phone}`);
            data.append('password', signupData.password);
            if (signupData.avatar) {
                data.append('avatar', signupData.avatar);
            }

            try {
                await register(data);
                toast.success('Registration successful! Please verify your email.');
                setIsLogin(true);
                setSignupData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    avatar: null,
                });
            } catch (error) {
                console.error(error);
                toast.error('Registration failed. Please try again.');
            }
        }
    };

    const handleForgotPassword = () => {
        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordMessage('Please enter your email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
            setForgotPasswordMessage('Please enter a valid email address');
            return;
        }

        // Demo functionality
        if (forgotPasswordEmail === 'user@example.com') {
            setForgotPasswordMessage('Password reset link sent to your email.');
        } else {
            setForgotPasswordMessage('Email not found.');
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF9E6]"
            // style={{ backgroundImage: "url('/bg.jpg')" }}
        >
            <Header />

            <div className="flex flex-1 justify-center items-center p-4">
                <div className="max-w-md w-full">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block">
                            <img src="/logo.png" alt="FarFoo" className="h-32 w-auto mx-auto" />
                        </Link>
                        <p className="text-gray-600">Welcome to natural goodness</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-yellow-300/20 mb-6">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setErrors({});
                                    setLoginError('');
                                }}
                                className={`py-3 rounded-2xl transition-all duration-300 ${isLogin
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setErrors({});
                                    setLoginError('');
                                }}
                                className={`py-3 rounded-2xl transition-all duration-300 ${!isLogin
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 shadow-md'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    {/* Forms Container */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-yellow-300/20">
                        {isLogin ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <h2 className="text-2xl text-gray-800 mb-6">Login to Your Account</h2>

                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-600">{loginError}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginInputChange}
                                            className={`w-full pl-12 pr-12 py-3 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>

                                <Link
                                    to={'/forgot-password'}
                                    type="button"
                                    // onClick={() => setShowForgotPassword(true)}
                                    className="w-full text-green-600 hover:text-green-700 transition-colors text-sm"
                                >
                                    Forgot Password?
                                </Link>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-bold"
                                >
                                    Login
                                </button>


                                {/* <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-2xl mb-2">
                                        <strong>Customer Login:</strong><br />
                                        Email: user@example.com<br />
                                        Password: password
                                    </p>
                                    <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-2xl border border-orange-200">
                                        <strong>Admin Login:</strong><br />
                                        Email: admin@farfoo.com<br />
                                        Password: admin123
                                    </p>
                                </div> */}
                            </form>
                        ) : (
                            <form onSubmit={handleSignup} className="space-y-4">
                                <h2 className="text-2xl text-gray-800 mb-6">Create Your Account</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={signupData.firstName}
                                            onChange={handleSignupInputChange}
                                            className={`w-full px-4 py-3 rounded-2xl border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="John"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={signupData.lastName}
                                            onChange={handleSignupInputChange}
                                            className={`w-full px-4 py-3 rounded-2xl border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={signupData.email}
                                            onChange={handleSignupInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={signupData.phone}
                                            onChange={handleSignupInputChange}
                                            maxLength={10}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="10-digit mobile"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={signupData.password}
                                            onChange={handleSignupInputChange}
                                            className={`w-full pl-12 pr-12 py-3 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="Min. 10 characters with special chars"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={signupData.confirmPassword}
                                            onChange={handleSignupInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all`}
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-bold"
                                >
                                    Create Account
                                </button>

                                <p className="text-xs text-gray-600 text-center">
                                    By signing up, you agree to our{' '}
                                    <Link to="/terms-conditions" className="text-green-600 hover:underline">
                                        Terms & Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy-policy" className="text-green-600 hover:underline">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-gray-800">Reset Password</h2>
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotPasswordEmail('');
                                    setForgotPasswordMessage('');
                                }}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => {
                                            setForgotPasswordEmail(e.target.value);
                                            setForgotPasswordMessage('');
                                        }}
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {forgotPasswordMessage && (
                                <div className={`rounded-2xl p-3 flex items-start gap-2 ${forgotPasswordMessage.includes('sent')
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}
                                >
                                    {forgotPasswordMessage.includes('sent') ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className={`text-sm ${forgotPasswordMessage.includes('sent') ? 'text-green-600' : 'text-red-600'
                                        }`}
                                    >
                                        {forgotPasswordMessage}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleForgotPassword}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-bold"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Login;