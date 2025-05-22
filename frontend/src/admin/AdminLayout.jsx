import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './admin-components/AdminHeader';

const AdminLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header with Navigation */}
            <AdminHeader />
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white p-4 shadow-inner">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;