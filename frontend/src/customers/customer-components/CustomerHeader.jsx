import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CustomerHeader = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [customerName, setCustomerName] = useState(localStorage.getItem('customerName') || 'Customer');
    const location = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        const handleStorage = () => {
            setCustomerName(localStorage.getItem('customerName') || 'Customer');
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('customerData');
            localStorage.removeItem('customerId');
            localStorage.removeItem('customerName');
            localStorage.removeItem('customerCode');
            localStorage.removeItem('userRole');
            nav('/');
        }
    };

    const navItems = [
        {
            name: 'Dashboard',
            path: '/customer',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'Products',
            path: '/customer/products',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        }
    ];

    return (
        <header className="bg-white border-b border-gray-200 shadow sticky top-0 z-50">
            {/* Top header with logo and actions */}
            <div className="px-4 py-3 lg:px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                className="block w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                type="text"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        >
                            <span className="sr-only">Notifications</span>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                                            <div className="flex">
                                                <div className="mr-3 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">Your order has shipped</p>
                                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                                            <div className="flex">
                                                <div className="mr-3 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">New product available</p>
                                                    <p className="text-xs text-gray-500">1 hour ago</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <a href="#" className="block px-4 py-2 text-sm text-center font-medium text-blue-600 hover:bg-gray-50">
                                            View all notifications
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                <img src="/image.png" alt="U" className="h-full w-full object-cover" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">{customerName}</span>
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <Link to="/customer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Profile</Link>
                                    <Link to="/customer/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Orders</Link>
                                    <div className="border-t border-gray-100"></div>
                                    <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem">Sign out</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="hidden md:block bg-white px-6 py-3 border-t border-gray-100">
                <ul className="flex space-x-8 justify-center">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                                        isActive
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
                    <ul className="space-y-1">
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                                            isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                        {/* Search on mobile */}
                        <li className="pt-2 pb-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    className="block w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    type="text"
                                    placeholder="Search products..."
                                />
                            </div>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default CustomerHeader;