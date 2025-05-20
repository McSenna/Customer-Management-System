import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './public-components/PublicHeader';

const PublicLayout = () => {
    return (
        <div>
            <header>
                <PublicHeader/>
            </header>

            <main> 
                <Outlet/>
            </main>
        </div>
    );
};

export default PublicLayout;