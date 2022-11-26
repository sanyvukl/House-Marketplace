import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRight } from "../../assets/svg/keyboardArrowRightIcon.svg";
import { sendPasswordReset } from "../../utils/firebase/firebase.utils";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const onChangeHandler = (e) => {
        const { value } = e.target;
        setEmail(value);
    };
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordReset(email);
            toast.success("Email was sent ");
        } catch (error) {
            toast.error("Error")
        }
    };

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Forgot Password</p>
            </header>
            <main>
                <form onSubmit={onSubmitHandler}>
                    <input
                        type="email"
                        name="email"
                        className="emailInput"
                        placeholder="Email"
                        value={email}
                        onChange={onChangeHandler}
                        required={true}
                    />
                    <Link className="forgotPasswordLink" to="/sign-in">
                        Sign In
                    </Link>

                    <div className="signInBar">
                        <div className="signInText">Send Reset Link</div>
                        <button className="signInButton">
                            <ArrowRight width="36px" height="36px" fill="#fff" />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};
export default ForgotPassword;
