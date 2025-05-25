import React, { useState, useMemo } from 'react';
import { Users, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock customer data for analytics calculations
    const customers = useMemo(() => [
        { id: 1, name: 'John Smith', email: 'john@email.com', totalSpent: 2500, orders: 12, lastPurchase: '2024-05-20', segment: 'vip', status: 'active', joinDate: '2023-01-15' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', totalSpent: 850, orders: 5, lastPurchase: '2024-05-18', segment: 'loyal', status: 'active', joinDate: '2023-03-22' },
        { id: 3, name: 'Mike Davis', email: 'mike@email.com', totalSpent: 1200, orders: 8, lastPurchase: '2024-05-15', segment: 'loyal', status: 'active', joinDate: '2023-02-10' },
        { id: 4, name: 'Emily Brown', email: 'emily@email.com', totalSpent: 320, orders: 2, lastPurchase: '2024-04-28', segment: 'new', status: 'active', joinDate: '2024-04-01' },
        { id: 5, name: 'David Wilson', email: 'david@email.com', totalSpent: 150, orders: 1, lastPurchase: '2024-03-10', segment: 'at-risk', status: 'inactive', joinDate: '2023-12-05' },
        { id: 6, name: 'Lisa Garcia', email: 'lisa@email.com', totalSpent: 3200, orders: 18, lastPurchase: '2024-05-22', segment: 'vip', status: 'active', joinDate: '2022-08-14' },
        { id: 7, name: 'Tom Anderson', email: 'tom@email.com', totalSpent: 680, orders: 4, lastPurchase: '2024-05-10', segment: 'regular', status: 'active', joinDate: '2023-06-18' },
        { id: 8, name: 'Amy Taylor', email: 'amy@email.com', totalSpent: 95, orders: 1, lastPurchase: '2024-01-15', segment: 'at-risk', status: 'inactive', joinDate: '2023-11-20' },
        { id: 9, name: 'Chris Lee', email: 'chris@email.com', totalSpent: 1800, orders: 9, lastPurchase: '2024-05-19', segment: 'loyal', status: 'active', joinDate: '2023-05-12' },
        { id: 10, name: 'Jessica Wang', email: 'jessica@email.com', totalSpent: 4500, orders: 22, lastPurchase: '2024-05-23', segment: 'vip', status: 'active', joinDate: '2022-11-08' }
    ], []);

    // Segment data for analytics
    const segmentData = useMemo(() => {
        const segments = customers.reduce((acc, customer) => {
            acc[customer.segment] = (acc[customer.segment] || 0) + 1;
            return acc;
        }, {});

        const total = customers.length;
        return Object.entries(segments).map(([segment, count]) => ({
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            value: count,
            percentage: (count / total) * 100,
            revenue: customers
                .filter(c => c.segment === segment)
                .reduce((sum, c) => sum + c.totalSpent, 0)
        }));
    }, [customers]);

    // Monthly trend data (mock)
    const monthlyTrend = [
        { month: 'Jan', newCustomers: 45, revenue: 12500 },
        { month: 'Feb', newCustomers: 52, revenue: 15200 },
        { month: 'Mar', newCustomers: 48, revenue: 14800 },
        { month: 'Apr', newCustomers: 61, revenue: 18900 },
        { month: 'May', newCustomers: 58, revenue: 17600 }
    ];

    const segmentColors = {
        'Vip': '#8b5cf6',
        'Loyal': '#10b981',
        'Regular': '#3b82f6',
        'New': '#f59e0b',
        'At-risk': '#ef4444'
    };

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.orders, 0);
    const activeCustomers = customers.filter(c => c.status === 'active').length;

    // CSS-based Bar Chart Component
    const BarChart = ({ data, title }) => {
        const maxValue = Math.max(...data.map(d => d.revenue));
        
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-16 text-sm font-medium text-gray-600">
                                {item.segment}
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-200 rounded-full h-6 relative">
                                    <div 
                                        className="bg-blue-500 h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                        style={{ width: `${(item.revenue / maxValue) * 100}%` }}
                                    >
                                        <span className="text-white text-xs font-medium">
                                            ${item.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // CSS-based Pie Chart Component
    const PieChart = ({ data, title }) => {
        let cumulativePercentage = 0;
        
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                            {data.map((segment, index) => {
                                const strokeDasharray = `${segment.percentage} ${100 - segment.percentage}`;
                                const strokeDashoffset = -cumulativePercentage;
                                const result = (
                                    <circle
                                        key={index}
                                        cx="50"
                                        cy="50"
                                        r="15.915"
                                        fill="transparent"
                                        stroke={segmentColors[segment.name]}
                                        strokeWidth="8"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                );
                                cumulativePercentage += segment.percentage;
                                return result;
                            })}
                        </svg>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {data.map((segment, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: segmentColors[segment.name] }}
                            ></div>
                            <span className="text-sm text-gray-600">
                                {segment.name} ({segment.percentage.toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Line Chart Component
    const LineChart = ({ data, title }) => {
        const maxRevenue = Math.max(...data.map(d => d.revenue));
        const maxCustomers = Math.max(...data.map(d => d.newCustomers));
        
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="grid grid-cols-5 gap-4 h-64">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-end space-y-2">
                            <div className="flex flex-col items-center space-y-1 h-full justify-end">
                                {/* Revenue Bar */}
                                <div className="flex flex-col items-center">
                                    <div 
                                        className="w-6 bg-blue-500 rounded-t transition-all duration-1000 ease-out"
                                        style={{ height: `${(item.revenue / maxRevenue) * 120}px` }}
                                    ></div>
                                    <span className="text-xs text-blue-600 font-medium mt-1">
                                        ${(item.revenue / 1000).toFixed(0)}k
                                    </span>
                                </div>
                                {/* Customer Bar */}
                                <div className="flex flex-col items-center">
                                    <div 
                                        className="w-4 bg-green-500 rounded-t transition-all duration-1000 ease-out"
                                        style={{ height: `${(item.newCustomers / maxCustomers) * 80}px` }}
                                    ></div>
                                    <span className="text-xs text-green-600 font-medium mt-1">
                                        {item.newCustomers}
                                    </span>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{item.month}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-600">New Customers</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Analytics Dashboard</h1>
                    <p className="text-gray-600">Comprehensive customer segmentation and analytics</p>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {['overview', 'segments'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <ShoppingCart className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                                        <p className="text-2xl font-bold text-gray-900">${avgOrderValue.toFixed(0)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Customers</p>
                                        <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PieChart data={segmentData} title="Customer Segments" />
                            <BarChart 
                                data={segmentData.map(s => ({ segment: s.name, revenue: s.revenue }))} 
                                title="Revenue by Segment" 
                            />
                        </div>

                        {/* Monthly Trends */}
                        <LineChart data={monthlyTrend} title="Monthly Trends" />
                    </div>
                )}

                {/* Segments Tab */}
                {activeTab === 'segments' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {segmentData.map((segment, index) => (
                                <div key={segment.name} className="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold" style={{ color: segmentColors[segment.name] }}>
                                            {segment.name} Customers
                                        </h3>
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segmentColors[segment.name] }}></div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-bold text-gray-900">{segment.value}</p>
                                        <p className="text-sm text-gray-600">customers ({segment.percentage.toFixed(1)}%)</p>
                                        <p className="text-lg font-semibold text-green-600">${segment.revenue.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">total revenue</p>
                                        <p className="text-sm text-gray-500">
                                            Avg: ${Math.round(segment.revenue / segment.value).toLocaleString()} per customer
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Segment Definitions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Definitions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border-l-4 border-purple-500 bg-purple-50 transform hover:scale-105 transition-transform">
                                    <h4 className="font-semibold text-purple-900">VIP Customers</h4>
                                    <p className="text-sm text-purple-700">$2000+ spent, 10+ orders, highly engaged</p>
                                </div>
                                <div className="p-4 border-l-4 border-green-500 bg-green-50 transform hover:scale-105 transition-transform">
                                    <h4 className="font-semibold text-green-900">Loyal Customers</h4>
                                    <p className="text-sm text-green-700">$500-$2000 spent, 5+ orders, regular purchases</p>
                                </div>
                                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 transform hover:scale-105 transition-transform">
                                    <h4 className="font-semibold text-blue-900">Regular Customers</h4>
                                    <p className="text-sm text-blue-700">$200-$500 spent, 2-4 orders, occasional purchases</p>
                                </div>
                                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 transform hover:scale-105 transition-transform">
                                    <h4 className="font-semibold text-yellow-900">New Customers</h4>
                                    <p className="text-sm text-yellow-700">Recently joined, 1-2 orders, potential to grow</p>
                                </div>
                                <div className="p-4 border-l-4 border-red-500 bg-red-50 md:col-span-2 transform hover:scale-105 transition-transform">
                                    <h4 className="font-semibold text-red-900">At-Risk Customers</h4>
                                    <p className="text-sm text-red-700">No recent purchases, declining engagement, needs attention</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;