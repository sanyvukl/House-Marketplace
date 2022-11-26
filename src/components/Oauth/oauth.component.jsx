import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Oauth = ({ imageUrl, signInMethod }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const onClickHandler = async () => {
        await signInMethod();
        navigate("/profile");
    };

    return (
        <div className="socialLogin">
            <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
            <button className="socialIconDiv" onClick={onClickHandler}>
                <img className="socialIconImg" src={imageUrl} alt="google sign in" />
            </button>
        </div>
    );
}

export default Oauth;