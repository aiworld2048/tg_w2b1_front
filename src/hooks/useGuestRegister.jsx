import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './baseUrl';
import { message } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import CredentialsDisplay from '../components/CredentialsDisplay';

const useGuestRegister = () => {
    const [error, setError] = useState();
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const { createGuestAccount: authCreateGuestAccount } = useContext(AuthContext);

    // Generate random username like PHP: 'P' + 8-digit random number
    const generateRandomUsername = () => {
        const randomNumber = Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
        return `P${randomNumber}`;
    };

    // Generate random name: GuestPlayer + 4-digit random number
    const generateRandomName = () => {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
        return `GuestPlayer${randomNumber}`;
    };

    const createGuestAccount = async () => {
        setLoading(true);
        try {
            // Generate random credentials
            const username = generateRandomUsername();
            const name = generateRandomName();
            const defaultPassword = '123123123';
            const default_referral_code = 'guestplayer';
            
            const guestData = {
                name: name,
                user_name: username,
                phone: null,
                password: defaultPassword,
                password_confirmation: defaultPassword,
                agent_id: 4, // parent_id for guest accounts
                status: 1,
                is_changed_password: 1,
                type: 40, // UserType::Player value
                referral_code: default_referral_code
            };

            const res = await axios.post(`${BASE_URL}/guest-register`, guestData);
            
            if (res.status === 200 || res.status === 201) {
                setError();
                setLoading(false);
                
                // Update auth context with new user data
                await authCreateGuestAccount(res.data.data.user, res.data.data.token);
                
                // Show credentials modal
                setCredentials({ username, password: defaultPassword });
                setShowCredentials(true);
                
                // Navigate to games page
                navigate('/?type=all');
                
                return res.data.data.user;
            }
        } catch (e) {
            setLoading(false);
            if (e.response?.data?.errors) {
                setError(e.response.data.errors);
            }
            if (e.response?.data?.message) {
                setErrMsg(e.response.data.message);
            } else {
                setErrMsg('Failed to create guest account. Please try again.');
            }
            message.error('Failed to create guest account. Please try again.');
            return null;
        }
        return null;
    };

    const handleCloseCredentials = () => {
        setShowCredentials(false);
        navigate('/?type=all');
    };

    return { 
        createGuestAccount, 
        error, 
        errMsg, 
        loading, 
        showCredentials, 
        credentials, 
        handleCloseCredentials 
    };
};

export default useGuestRegister; 