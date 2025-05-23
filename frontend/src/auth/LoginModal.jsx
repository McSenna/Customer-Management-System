import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { X, LogIn, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import CreateAccountModal from './CreateAccountModal';

const LoginModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
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

        // Admin login hardcoded check
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
                setError(alert(response.data.message || 'Login failed'));
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
                localStorage.setItem('customerAddress', customerData.customer_address);
                localStorage.setItem('customerPhone', customerData.customer_phone);
                localStorage.setItem('userRole', 'customer');
                
                setLoading(false);
                navigate('/customer');
            } else {
                setError(alert('Something went wrong. Please try again.'));
                setLoading(false);
            }

        } catch (error) {
            console.error('Error logging in:', error);
            setError(alert('Login failed. Please check your credentials and try again.'));
            setLoading(false);
        }
    }

    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        setShowCreateModal(true);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
    };

    const handleCustomerCreated = (customerData) => {
        console.log('New customer created:', customerData);
        // Optionally auto-fill login form with new customer's email
        setEmail(customerData.email);
        setShowCreateModal(false);
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                    {/* Modal Header */}
                    <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-2 rounded-md">
                                <LogIn className="h-5 w-5 text-blue-600" />
                            </div>
                            <h1 className="text-xl font-semibold text-gray-800">CustomerCRM</h1>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Sign in to your account
                        </h2>
                        
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-5 flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 pl-10 text-sm rounded-md block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-white border border-gray-300 text-gray-900 pl-10 text-sm rounded-md block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center">
                                    <input 
                                        id="remember_me" 
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>
                                
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 mt-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '} <br />
                            <button 
                                onClick={handleCreateAccountClick}
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors underline"
                            >
                                Create an account
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Create Account Modal */}
            <CreateAccountModal 
                isOpen={showCreateModal}
                onClose={handleCreateModalClose}
                onCustomerCreated={handleCustomerCreated}
            />
        </>
    );
};

export default LoginModal;