import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <div className="admin-header">
            <div className="admin-header-title">
                <h1>Admin Dashboard</h1>
            </div>
            <nav className="admin-navigation">
                <ul>
                    <li>
                        <Link to="/admin">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/customers">Customers</Link>
                    </li>
                    <li>
                        <Link to="/">Back to Public Site</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminHeader;