import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerHeader from './customer-components/CustomerHeader';
import ChatSupport from '../components/ChatSupport';

const CustomerLayout = () => {
    return (
        <div className="customer-layout">
            <header>
                <CustomerHeader/>
            </header>
            
            <main className="customer-content">
                <Outlet />
            </main>

            <ChatSupport /> 
        </div>
    );
};

export default CustomerLayout;