import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";
import Spinner from "../Spinner/spinner.component";

const PrivateRoute = () => {
    const { isUserLoading, currentUser } = useContext(UserContext);

    if (isUserLoading) {
        return <Spinner />
    }
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute;