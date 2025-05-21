import React from 'react';

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <h1 className='text-4xl font-extrabold'>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className='mt-10'>Go Home</a>
        </div>
    );
};

export default NotFound;