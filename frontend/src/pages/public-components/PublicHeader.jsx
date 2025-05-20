import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import LoginModal from '../../auth/LoginModal';

const PublicHeader = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = (e) => {
        e.preventDefault();
        setShowLoginModal(true);
    };

    return (
        <>
            <div className="bg-white shadow-sm z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-blue-600">CustomerCRM</h1>
                    </div>
                    
                    {/* Navigation Links (Center) */}
                    <nav className="hidden md:flex items-center justify-center space-x-8">
                        <Link to="/" className="font-medium text-gray-600 hover:text-blue-600">Home</Link>
                        <Link to="/about" className="font-medium text-gray-600 hover:text-blue-600">About</Link>
                        {/* <Link to="/about" className="font-medium text-gray-600 hover:text-blue-600">Tickets</Link>
                        <Link to="/reports" className="font-medium text-gray-600 hover:text-blue-600">Reports</Link> */}
                    </nav>
                    
                    {/* Right Side: Search, Notifications, and Login */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button (click to expand) */}
                        <div className="relative">
                            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* Notifications */}
                        <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                            <Bell className="h-5 w-5" />
                        </button>
                        
                        {/* Login Button - Modified to show modal instead of navigating */}
                        <button 
                            onClick={handleLoginClick}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-1 rounded-full text-gray-500 hover:bg-gray-100"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Navigation Menu */}
                {showMobileMenu && (
                    <div className="md:hidden px-4 py-3 bg-gray-50 border-t">
                        <nav className="flex flex-col space-y-3">
                            <Link to="/" className="font-medium text-gray-600 hover:text-blue-600 py-2">Dashboard</Link>
                            <Link to="/customers" className="font-medium text-gray-600 hover:text-blue-600 py-2">Customers</Link>
                            <Link to="/tickets" className="font-medium text-gray-600 hover:text-blue-600 py-2">Tickets</Link>
                            <Link to="/reports" className="font-medium text-gray-600 hover:text-blue-600 py-2">Reports</Link>
                        </nav>
                    </div>
                )}
            </div>

            {/* Render the LoginModal conditionally when showLoginModal is true */}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </>
    );
};

export default PublicHeader;