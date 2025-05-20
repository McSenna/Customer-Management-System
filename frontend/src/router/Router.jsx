import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicHomePages from '../pages/public-pages/PublicHomePages';
import PublicLayout from '../pages/PublicLayout';
import CustomerLayout from '../customers/CustomerLayout';
import CustomerDashboard from '../customers/customers-pages/CustomerDashboard';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/admin-pages/AdminDashboard';
import AdminCustomers from '../admin/admin-pages/AdminCustomers';
import PublicAboutPage from '../pages/public-pages/PublicAboutPage';

const Router = () => {
    return (
        <BrowserRouter> 
            <Routes>
                {/* Public Routes */}
                <Route path='/' element={<PublicLayout/>}>
                    <Route index element={<PublicHomePages />} />
                    <Route path='/about' element={<PublicAboutPage />} />
                </Route>
                
                {/* Customer Routes */}
                <Route path='/customer' element={<CustomerLayout/>}>
                    <Route index element={<CustomerDashboard />} />
                    {/* Add more customer routes here as needed */}
                </Route>
                
                {/* Admin Routes */}
                <Route path='/admin' element={<AdminLayout/>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    {/* Add more admin routes here as needed */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;