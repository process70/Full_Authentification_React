import React from 'react'
import axios from '../api/axios'
import useAuth from './useAuth'

const useLogout = () => {
    const {setAuth} = useAuth()

    const logout = async() => {
        setAuth({})
        try {
            // withCredentials anables us to send a secure http only cookie that contains jwt
            const response = axios.get('/logout', {withCredentials: true})
        } catch (err) {
            console.error(err)
        }
    }

  return logout 
}

export default useLogout
