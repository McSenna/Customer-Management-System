import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './public-components/PublicHeader';
import Sidebar from './public-components/Sidebar';

const PublicLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header>
                    <PublicHeader />
                </header>

                <main className="flex-1 overflow-y-auto p-6"> 
                    <Outlet />
                </main>
                
                <footer className="bg-white p-4 border-t">
                    <div className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Customer Management System. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PublicLayout;