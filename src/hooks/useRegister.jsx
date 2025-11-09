import { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { AuthContext } from '../contexts/AuthContext';

const useRegister = () => {
    const [error, setError] = useState();
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { authenticate } = useContext(AuthContext);

    const register = async (url, inputData) => {
        setLoading(true);
        try {
            const res = await axios.post(url, inputData);
            if (res.status === 200) {
                setError();
                setLoading(false);
                const { token, user } = res.data.data ?? {};
                await authenticate(token, user, { skipProfileFetch: true });
                navigate('/?type=all');
                message.success('Registerd Successfully.');
                return user;
            }
        } catch (e) {
            setLoading(false);
            setError(e.response.data.errors);
            setErrMsg(e.response.data.message);
            return;
        }
        return null;
    };

    return { register, error, errMsg, loading };
};

export default useRegister;
