import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Register = () => {
    /* Must start with a letter
    Can contain letters, numbers, hyphens, and underscores
    Must be between 4 and 24 characters long (1 initial letter + 3 to 23 additional characters) */
    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

    /* Must contain at least one lowercase letter
    Must contain at least one uppercase letter
    Must contain at least one digit
    Must contain at least one special character from !@#$%
    Must be between 8 and 24 characters long */
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const REGISTER_URL = '/register';

    const userRef = useRef()  // focus on user input when the component loads
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false); // to confirm the password
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])


    const handleSubmit = async(e) => {
        e.preventDefault();
        if(USER_REGEX.test(user) && PWD_REGEX.test(pwd)){
            try {
                const response = await axios.post(REGISTER_URL, {user, pwd, confirmPassword: matchPwd}, {
                    headers: {"Content-Type" :"application/json"}
                })
                console.log(JSON.stringify(response?.data?.success))
                console.log(user +', '+ pwd)
                setSuccess(true);
                setUser('');
                setPwd('');
                setMatchPwd('')

            } catch (err) {
                // in case of the backend server is not running
                if (!err?.response) {
                    setErrMsg('No Server Response');
                } else if (err.response?.status === 409) {
                    setErrMsg('Username Taken');
                } else {
                    setErrMsg('Registration Failed :'+ (err?.response?.data?.message))
                }
                errRef.current.focus();
            }
        }
    }
  return (
    <>
        {success ? (
            <section>
                <h1>Success!</h1>
                <p> <Link to="/login">Sign In</Link> </p>
                </section>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username:
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        {/* !user means that we didn't fill the input */}
                        <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                    </label>
                    {/* aria-describedby: it provides a way to associate descriptive text with form controls or other elements */}
                    <input type="text" id="username" ref={userRef} autoComplete="off" value={user} required
                        onChange={(e) => setUser(e.target.value)} onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)}/>
                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>


                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </label>
                    <input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} 
                        aria-invalid={validPwd ? "false" : "true"} aria-describedby="pwdnote" 
                        onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} required
                    />
                    <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: !@#$%
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </label>
                    <input type="password" id="confirm_pwd" onChange={(e) => setMatchPwd(e.target.value)} value={matchPwd}
                        required aria-invalid={validMatch ? "false" : "true"} aria-describedby="confirmnote" 
                        onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

                    <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                </form>

                <p> Already registered?<br /> 
                    <span className="line"> 
                        <Link to="/login">Sign In</Link> 
                    </span> 
                </p>
            </section>
        )}
    </>
  )
}

export default Register
