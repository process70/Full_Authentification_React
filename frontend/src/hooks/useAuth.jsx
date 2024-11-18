import { useContext } from "react";
import AuthContext from "../context/XYZ";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;