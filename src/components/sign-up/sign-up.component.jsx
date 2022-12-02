import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";


import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";

import { toast } from "react-toastify";
import Oauth from "../Oauth/oauth.component";
import googleIcon from "../../assets/svg/googleIcon.svg";

const SignUp = () => {
    const navigate = useNavigate();
    const { signInWithGoogle, signUpWithEmail } = useContext(UserContext);

    const [isShowPasswod, setIsShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
    });
    const { displayName, email, password } = formData;
    const checkErrors = (error) => {
        switch (error.code) {
            case "auth/email-already-in-use":
                toast.error("User is already exist");
                break;
            default:
                toast.error("sorry try agian later");
                console.log(error.code);
                break;
        };
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await signUpWithEmail(email, password, { displayName });
            resetFormFields();
            navigate("/");
        } catch (error) {
            checkErrors(error);
        }
    };
    const onChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };
    const togglePassword = () => setIsShowPassword(!isShowPasswod);
    const resetFormFields = () => setFormData({ email: "", password: "" });
    const GoogleSignIn = async () => signInWithGoogle();

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Welcome Back!</p>
            </header>
            <form onSubmit={onSubmitHandler}>
                <input
                    id="displayName"
                    type="name"
                    className="nameInput"
                    placeholder="Name"
                    value={displayName}
                    onChange={onChange}
                    required={true}
                />
                <input
                    id="email"
                    type="email"
                    className="emailInput"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                    required={true}
                />
                <div className="passwordInputDiv">
                    <input
                        id="password"
                        type={isShowPasswod ? "text" : "password"}
                        className="passwordInput"
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                        required={true}

                    />
                    <img
                        src={visibilityIcon}
                        alt="show password"
                        className="showPassword"
                        onClick={togglePassword}
                        required={true}
                    />
                </div>
                <Link to="/forgot-password" className="forgotPasswordLink">
                    Forgot Password
                </Link>
                <div className="signUpBar">
                    <p className="signUpText">
                        Sign Up
                    </p>
                    <button className="signUpButton">
                        <ArrowRightIcon fill="#fff" width="34px" height="34px" />
                    </button>
                </div>
            </form>
            <Oauth onClick={GoogleSignIn} imageUrl={googleIcon} signInMethod={GoogleSignIn} />
            <div className="registerLinkContainer">
                <Link to="/sign-in" className="registerLink">Sign In Instead</Link>
            </div>
        </div>
    );
};
export default SignUp;
