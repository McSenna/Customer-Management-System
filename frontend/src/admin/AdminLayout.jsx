import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './admin-components/AdminHeader';


const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <header>
                <AdminHeader/>
            </header>
            
            <main className="admin-content">
                <Outlet/>
            </main>
        </div>
    );
};

export default AdminLayout;