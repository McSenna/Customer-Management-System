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
                
            </div>
        </div>
    );
};

export default PublicLayout;