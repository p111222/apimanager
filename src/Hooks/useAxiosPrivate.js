import { useEffect, useContext } from "react";
import { axiosPrivate } from "../Axios";
import useRefreshToken from "./useRefreshToken";
import { AuthContext } from '../Context/AuthContext';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { user, setUser, sessionValidity, setSessionValidity, accessToken } = useContext(AuthContext);

    console.log(sessionValidity);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            async (config) => {
                if (config.url && config.url.includes('auth')) {
                    return config;
                }

                try {
                    const response = await axiosPrivate.get(`/auth/check-session`);
                    console.log("response.data.valid"+response.data);
                    if (response.data === 'valid') {
                        setSessionValidity('valid');
                        if (!config.headers['Authorization']) {
                            config.headers['Authorization'] = `Bearer ${accessToken}`;
                        }
                        return config;
                    } else {
                        setSessionValidity("invalid");
                        throw new Error('Invalid session');
                    }
                } catch (error) {
                    console.error('Session check failed', error);
                    throw error;
                }
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
