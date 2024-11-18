import React, { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToggle from "../hooks/useToggle";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useToggle('persist', false)
  
  useEffect(() => {
      // when you put isMounted outside of useEffect is value will not changed after the component remount 
      let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        // to prevent setting the isLodaing state when the component is unmounted
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => isMounted = false
  }, []);

  return (
    <div>
      {/* Show a loading indicator while verifying/refreshing the token.
      Prevent rendering the main content (<Outlet />) until the token verification is complete.   */}
      {
        !persist ? <Outlet /> : 
            isLoading ? <p>Loading ...</p> : 
            <Outlet /> }
    </div>
  );
};

export default PersistLogin;
