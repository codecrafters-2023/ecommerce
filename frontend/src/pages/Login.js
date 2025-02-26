import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header'; // ✅ Import Header

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            // Error handled in auth context
        }
    };

    return (
        
        <div 
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }} // ✅ Add Background Image
    >            {/* ✅ Fixed Header Placement */}
            <Header /> 

            {/* ✅ Centered Login Form */}
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome Back 👋</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all"
                        >
                            Login
                        </button>
                    </form>

                    <div className="text-center mt-4 text-gray-600">
                        <Link to="/forgot-password" className="hover:text-blue-500">Forgot Password?</Link>
                    </div>
                    
                    <div className="text-center mt-2 text-gray-600">
                        New here? <Link to="/register" className="text-blue-500 font-medium hover:underline">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;