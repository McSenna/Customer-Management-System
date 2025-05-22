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

        </div>
    );
};

export default AdminLayout;