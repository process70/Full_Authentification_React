import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, seterror] = useState('')
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getUsers = async() => {
        try {
            const response = await axios.get('/users', { signal: controller.signal })
            // to prevent setting the users list when the component unmounts
            isMounted && setUsers(response?.data)
        } catch (err) {
            // to prevent displaying the error while the component unmounts
            isMounted && console.error('Error fetching users:', err);
            isMounted && seterror(err)
        }
    }
    getUsers()
    return () => {
        isMounted = false;
        controller.abort()
    }
  }, [])

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users?.map((user, i) => (
            <li key={i}>{user?.user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
