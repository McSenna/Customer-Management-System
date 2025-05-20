import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    Users, 
    MessageSquare, 
    FileText, 
    BarChart2, 
    Settings, 
    HelpCircle,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    
    const navItems = [
        { name: 'Home', icon: <Home className="w-5 h-5" />, path: '/' },
        { name: 'Customers', icon: <Users className="w-5 h-5" />, path: '/customers' },
        { name: 'Conversations', icon: <MessageSquare className="w-5 h-5" />, path: '/conversations' },
        { name: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports' },
        { name: 'Analytics', icon: <BarChart2 className="w-5 h-5" />, path: '/analytics' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
        { name: 'Help', icon: <HelpCircle className="w-5 h-5" />, path: '/help' },
    ];
    
    return (
        <div className="bg-white w-64 h-full shadow-lg flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
                <Link to="/" className="flex items-center">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                        CM
                    </div>
                    <span className="ml-3 text-xl font-semibold">CMS Admin</span>
                </Link>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="px-2">
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span className="flex-1">{item.name}</span>
                                {location.pathname === item.path && (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            
            {/* Pro Upgrade Banner */}
            <div className="p-4 m-4 mb-6 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Upgrade to Pro</h4>
                <p className="text-xs text-blue-600 mb-2">Get more features and premium support</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};

export default Sidebar;