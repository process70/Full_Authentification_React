import React, { useEffect, useRef, useState } from 'react'
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';

const LOGIN_URL = '/login';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {setAuth} = useAuth()

    const [user, resetUser, attributeObj] = useInput('user', '') // useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, toggleCheck] = useToggle('persist', false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

/*     const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem('persist', persist)
    }, [persist]) */

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(user && pwd){
            try {
                const response = await axios.post(LOGIN_URL, JSON.stringify({user, pwd}), {
                    headers: {'Content-Type' : 'application/json'},
                    withCredentials: true
                });
                setAuth({ user, pwd, roles: response?.data?.roles, accessToken: response?.data?.accessToken })
                // setUser('');
                resetUser()
                setPwd('');
                // Returning a user to the page they were trying to access before being redirected to login
                navigate(from, { replace: true });
            } catch (error) {
                if(!error?.response) 
                    setErrMsg("Internal Server Error");
                else if(error.response?.status === 401) 
                        setErrMsg("Unauthorized, username or password incorrect")
                else setErrMsg("Login Failed")

                errRef.current.focus()
                     
            }
            
        }
        else {
            setErrMsg("Username and Password are required !!!")
            errRef.current.focus()
        }
        console.log(errMsg)
    }
    

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    { ...attributeObj}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
                <div className="persistCheck">
                    <input type="checkbox" id='persist' checked={persist} onChange={toggleCheck}/>
                    <label htmlFor="persist">Trust This Device</label>
                </div>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    )
}

export default Login
