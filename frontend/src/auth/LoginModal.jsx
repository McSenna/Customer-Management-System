import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

const LoginModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Email validation
        if (!email || !password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        // Admin login hardcoded check (you might want to move this to server-side)
        if (email === 'admin@gmail.com' && password === 'password') {
            setLoading(false);
            localStorage.setItem('userRole', 'admin');
            alert('Admin login successful');
            navigate('/admin');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}login`, {      
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
             
            console.log('Login response:', response.data);
            
            if(response.data.type === 'error') {
                setError(response.data.message || 'Login failed');
                setLoading(false);
                return;
            }
            
            if(response.data.type === 'success') {
                // Store customer data in localStorage or state management
                const customerData = response.data.customer;
                localStorage.setItem('customerData', JSON.stringify(customerData));
                localStorage.setItem('customerId', customerData.id);
                localStorage.setItem('customerName', customerData.name);
                localStorage.setItem('customerCode', customerData.customer_code);
                localStorage.setItem('userRole', 'customer');
                
                setLoading(false);
                navigate('/customer');
            } else {
                setError('Something went wrong. Please try again.');
                setLoading(false);
            }

        } catch (error) {
            console.error('Error logging in:', error);
            setError('Login failed. Please check your credentials and try again.');
            setLoading(false);
        }
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-blue-600">CustomerCRM</h1>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;