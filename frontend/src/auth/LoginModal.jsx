import axios from 'axios';
import React, { useEffect, useState } from 'react';

const LoginModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        handleLogin();
    },[]);

    const apiUrl = ' ';

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${apiUrl}login`, {
                email,
                password
            });

        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <div>
            
        </div>
    );
};

export default LoginModal;