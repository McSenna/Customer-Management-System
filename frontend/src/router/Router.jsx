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
import AdminProducts from '../admin/admin-pages/AdminProducts';
import AdminOrders from '../admin/admin-pages/AdminOrders';
import NotFound from '../auth/NotFound';
import OrdersCart from '../customers/orders/OrdersCart';
import CustomerProducts from '../customers/customers-pages/CustomerProducts';
import CustomerProfile from '../customers/customers-pages/CustomerProfile';

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
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="products" element={<CustomerProducts/>} />
                    <Route path="orders" element={<OrdersCart/>} />
                    <Route path="profile" element={<CustomerProfile/>} />
                    {/* Add more customer routes here */}
                </Route>
                
                {/* Admin Routes */}
                <Route path='/admin' element={<AdminLayout/>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
                
            </Routes>
        </BrowserRouter>
    );
};

export default Router;