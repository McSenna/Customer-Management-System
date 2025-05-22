import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, CreditCard, MapPin, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
    const [customerData, setCustomerData] = useState({
        id: '',
        name: '',
        customer_code: '',
        email: '',
        phone: '',
        address: 'No address available',
        registration_date: 'Not available',
        subscription_status: 'Inactive'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve customer data from localStorage
        const storedData = localStorage.getItem('customerData');
        const customerId = localStorage.getItem('customerId');
        const customerName = localStorage.getItem('customerName');
        const customerCode = localStorage.getItem('customerCode');
        const customerPhone = localStorage.getItem('customerPhone');
        const customerAddress = localStorage.getItem('customerAddress');
        const userRole = localStorage.getItem('userRole');
        
        // Check if user is logged in as a customer
        if (!userRole || userRole !== 'customer') {
            alert('Please login to access your profile');
            navigate('/login');
            return;
        }

        if (storedData) {
            try {
                // Parse stored JSON data
                const parsedData = JSON.parse(storedData);
                setCustomerData({
                    ...customerData,
                    ...parsedData,
                    id: customerId || parsedData.id || '',
                    name: customerName || parsedData.name || '',
                    customer_code: customerCode || parsedData.customer_code || '',
                    customer_adress : customerAddress || parsedData.customer_adress || 'No address available',
                    phone: customerPhone || parsedData.phone || '',
                });
            } catch (error) {
                console.error('Error parsing customer data:', error);
            }
        } else if (customerId && customerName && customerCode) {
            // If we only have basic data but not the full object
            setCustomerData({
                ...customerData,
                id: customerId,
                name: customerName,
                customer_code: customerCode
            });
            
            // You could fetch additional customer data from API here if needed
            // fetchCustomerData(customerId);
        }
        
        setLoading(false);
    }, [navigate]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-white p-3 rounded-full mr-4">
                                <User className="h-12 w-12 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{customerData.name}</h1>
                                <p className="text-blue-100">Customer ID: {customerData.customer_code}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Contact Information Card */}
                    <div className="col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="text-gray-800">{customerData.email || 'Not available'}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="text-gray-800">{customerData.phone || 'Not available'}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-800">{customerData.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Account Details Card */}
                    <div className="col-span-1 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Account Details</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Registration Date</p>
                                    <p className="text-gray-800">{customerData.registration_date}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Subscription Status</p>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        customerData.subscription_status === 'Active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {customerData.subscription_status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Activity & Options */}
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center items-center h-32 text-gray-500">
                                    <p>No recent activity to display</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <FileText className="h-6 w-6 text-blue-600 mb-2" />
                                    <span className="text-sm text-gray-700">View Orders</span>
                                </button>
                                
                                <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Settings className="h-6 w-6 text-blue-600 mb-2" />
                                    <span className="text-sm text-gray-700">Edit Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;