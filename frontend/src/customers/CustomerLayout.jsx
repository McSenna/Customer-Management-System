import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerHeader from './customer-components/CustonerHeader'

const CustomerLayout = () => {
    return (
        <div className="customer-layout">
            <header>
                <CustomerHeader />
            </header>
            
            <main className="customer-content">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;