import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/XYZ";
import useAuth from "../hooks/useAuth";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { auth } = useAuth()

    /* When called, it uses the navigate function to go back one step in the navigation history.
    The -1 argument tells navigate to bring the user back they were on , 
    similar to clicking the browser's back button. */
    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Unauthorized</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized