import axios from '../Axios';
import { useContext } from 'react';
import {AuthContext} from '../Context/AuthContext';

const useRefreshToken = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);

    const refresh = async () => {
        const response = await axios.get('/auth/regenerate-accesstoken', {
            withCredentials: true
        });
        setAccessToken(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;