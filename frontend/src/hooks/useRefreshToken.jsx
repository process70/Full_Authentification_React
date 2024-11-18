import React from 'react'
import useAuth from './useAuth'
import axios from '../api/axios'

const useRefreshToken = () => {
    const {setAuth} = useAuth()
    const refresh = async() => {
        // withCredentials: true allow to send the secure cookie
        const response = await axios.get('/refresh', {withCredentials: true})
        setAuth(prev => {
            console.log('previous auth: '+prev.accessToken)
            console.log('the new access token: '+response?.data?.accessToken)
            /* set the accessToken in auth context with the new one
            set also the roles in case where the user refresh the page in this case we lost roles */
            return { ...prev, accessToken: response?.data?.accessToken, roles: response?.data?.roles}
        })
        return response?.data?.accessToken
    }
  return refresh
}

export default useRefreshToken
