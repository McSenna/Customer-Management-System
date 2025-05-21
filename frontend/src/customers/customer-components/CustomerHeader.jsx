import React from 'react';
import { Link } from 'react-router-dom';

const CustomerHeader = () => {
    return (
        <div className="customer-header">
            <div className="customer-header-title">
                <h1>Customer Portal</h1>
            </div>
            <nav className="customer-navigation">
                <ul>
                    <li>
                        <Link to="/customer">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/">Back to Public Site</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default CustomerHeader;