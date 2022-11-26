import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";
import Spinner from "../Spinner/spinner.component";

const PrivateRoute = () => {
    const { isLogged, isLoading } = useContext(UserContext);
    if (isLoading) {
        return <Spinner />
    }
    return isLogged ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute;