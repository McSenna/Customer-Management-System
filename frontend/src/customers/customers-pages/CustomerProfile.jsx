import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, CreditCard, MapPin, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerProfile = () => {
    const [customerData, setCustomerData] = useState({
        id: '',
        name: '',
        customer_code: '',
        email: '',
        phone: '',
        address: 'No address available',
        registration_date: 'Not available',
        subscription_status: 'Inactive',
        loyalty_points: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const apiUrl = 'http://localhost/customer-management-system/backend/api.php?action=';

    useEffect(() => {
        const customerId = localStorage.getItem('customerId');
        const userRole = localStorage.getItem('userRole');

        // Check if user is logged in as a customer
        if (!userRole || userRole !== 'customer' || !customerId) {
            alert('Please login to access your profile');
            navigate('/login');
            return;
        }

        // Fetch customer data from API
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`${apiUrl}get_customer`, {
                    params: { customer_id: customerId }
                });
                const { error, message, data } = response.data;

                if (error) {
                    throw new Error(message || 'Failed to fetch customer data');
                }

                setCustomerData({
                    id: data.id || '',
                    name: data.name || '',
                    customer_code: data.customer_code || '',
                    email: data.email || 'Not available',
                    phone: data.phone || 'Not available',
                    address: data.address || 'No address available',
                    registration_date: data.created_at || 'Not available',
                    subscription_status: data.subscription_status || 'Inactive',
                    loyalty_points: data.loyalty_points || 0
                });
            } catch (err) {
                console.error('Error fetching customer data:', err);
                setError('Failed to load profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
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
                                    <p className="text-gray-800">{customerData.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="text-gray-800">{customerData.phone}</p>
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
                            
                            <div className="flex items-center">
                                <div className="bg-blue-50 p-2 rounded-md mr-4">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Loyalty Points</p>
                                    <p className="text-gray-800">{customerData.loyalty_points}</p>
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