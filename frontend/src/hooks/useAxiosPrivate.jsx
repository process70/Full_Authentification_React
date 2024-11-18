import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            request => {
                // Checks if the 'Authorization' header is missing.
                if (!request.headers['Authorization']) {
                    request.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return request;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                // get the previous request
                const prevRequest = error?.config;
                /* 403 (Forbidden) errors indicates the expired access token.
                in other implementation we use originalRequest?._retry instead of prevRequest?.sent,
                whether you use sent, _retry, or any other property name, the core logic remains the same. 
                The key is to have a flag that prevents multiple retry attempts for the same request, 
                thus avoiding potential infinite loops. */
                if (error?.response?.status === 403 && !prevRequest?.kadour) {
                    // Marks the request as sent to prevent infinite loops.
                    prevRequest.kadour = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Retries the original request with the new token.
                    return axiosPrivate(prevRequest);
                }
                /* let the calling code handle the error, we reject the Promise with the original error.
                we ensure that all errors are properly propagated and can be handled appropriately by the application code */
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;