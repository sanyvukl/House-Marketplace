import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";

import { useContext } from "react";
import { UserContext } from "../../context/user/user.context";

import { toast } from "react-toastify";
import Oauth from "../Oauth/oauth.component";
import googleIcon from "../../assets/svg/googleIcon.svg";
import { getListingsAndDocuments } from "../../utils/firebase/firebase.utils";

const SignIn = () => {
    const navigate = useNavigate();
    const { signInWithEmail, signInWithGoogle, setIsLoading } = useContext(UserContext);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;
    const checkErrors = (error) => {
        switch (error.code) {
            case "auth/wrong-password":
                toast.error("Wrong Password");
                break;

            case "auth/user-not-found":
                toast.error("User is not found");
                break;

            default:
                toast.error("sorry try agian later");
                console.log(error);
                break;
        };
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmail(email, password);
            toast.success("Signed In Succesfully");
            resetFormFields();
            navigate('/profile');
        } catch (error) {
            checkErrors(error);
        }
        setIsLoading(false);
    }
    const onChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };
    const togglePassword = () => setIsShowPassword(!isShowPassword);
    const GoogleSignIn = async () => await signInWithGoogle();
    const resetFormFields = () => setFormData({ email: "", password: "" });

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Welcome Back!</p>
            </header>
            <form onSubmit={onSubmitHandler}>
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
                        type={isShowPassword ? "text" : "password"}
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
                    />
                </div>

                <Link to="/forgot-password" className="forgotPasswordLink">
                    Forgot Password
                </Link>

                <div className="signInBar">
                    <p className="signInText">
                        Sign In
                    </p>
                    <button className="signInButton">
                        <ArrowRightIcon fill="#fff" width="34px" height="34px" />
                    </button>
                </div>
            </form>
            <Oauth onClick={GoogleSignIn} imageUrl={googleIcon} signInMethod={GoogleSignIn} />
            <Link to="/sign-up" className="registerLink">Sign Up Instead</Link>
        </div>
    );
};
export default SignIn;
