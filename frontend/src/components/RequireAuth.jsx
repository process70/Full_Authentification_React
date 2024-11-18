import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import AuthContext from "../context/XYZ";

const RequireAuth = ({ allowedRoles }) => {
    const {auth} = useAuth()
    const location = useLocation();

    return (
        /* auth?.roles: the roles that the user have
        allowedRoles: the requested page that require these roles */
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user
                /* Navigate: It's used to redirect users to a different route from within your JSX.
                state: {{from: location}}: This is often used to keep track of where 
                the user came from before being redirected. 
                The replace prop ensures that the unauthorized page replaces the current page in history, 
                preventing the user from navigating back to a protected route. 
                replace: this prop means that Clicking the browser's back button will NOT take the user back to the previous page. 
                that's why we use go back button in Unauthorized element*/
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
