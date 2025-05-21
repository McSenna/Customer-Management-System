import React from 'react';

const CustomerDashboard = () => {
    return (
        <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Your Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Recent Orders Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <a href="/customer/orders" className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">#12345</p>
                                <p className="text-sm text-gray-500">May 18, 2025</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Delivered</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">#12344</p>
                                <p className="text-sm text-gray-500">May 10, 2025</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Shipped</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                                <p className="font-medium">#12343</p>
                                <p className="text-sm text-gray-500">April 29, 2025</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Delivered</span>
                        </div>
                    </div>
                </div>
                
                {/* Account Summary Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Account Summary</h2>
                        <a href="/customer/profile" className="text-sm text-blue-600 hover:text-blue-800">Edit Profile</a>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                <img src="/image.png" alt="Profile" className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Customer Name</p>
                                <p className="text-sm text-gray-500">customer@example.com</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Member Since</span>
                                <span className="font-medium">January 2025</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-medium">12</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Rewards Points</span>
                                <span className="font-medium text-blue-600">325 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recommended Products Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recommended For You</h2>
                        <a href="/customer/products" className="text-sm text-blue-600 hover:text-blue-800">Browse All</a>
                    </div>
                    <div className="space-y-4">
                        <div className="flex space-x-3">
                            <div className="h-16 w-16 bg-gray-200 rounded-md flex-shrink-0"></div>
                            <div>
                                <p className="font-medium">Product Name</p>
                                <p className="text-sm text-gray-500">$29.99</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">(42)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <div className="h-16 w-16 bg-gray-200 rounded-md flex-shrink-0"></div>
                            <div>
                                <p className="font-medium">Product Name</p>
                                <p className="text-sm text-gray-500">$49.99</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`h-4 w-4 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">(18)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;