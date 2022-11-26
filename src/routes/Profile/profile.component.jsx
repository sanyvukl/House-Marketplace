import { useContext, useState } from "react";
import { UserContext } from "../../context/user/user.context";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../../assets/svg/homeIcon.svg";

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser, logOutUser, updateUserData } = useContext(UserContext);
    const [isChangedDetails, setIsChangedDetails] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState(currentUser);
    const { displayName, email } = currentUserInfo;

    const onLogOutHandle = () => {
        logOutUser();
        navigate("/sign-in");
    };
    const onChangeDetails = () => {
        setIsChangedDetails(!isChangedDetails);
    };
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setCurrentUserInfo({ ...currentUserInfo, [name]: value });
    };
    const onUpdateSubmit = async () => {
        if (!currentUser) return;
        const updateData = {
            displayName: displayName,
            email: email,
        }
        if (currentUser.displayName !== displayName || currentUser.email !== email) {
            try {
                await updateUserData(updateData);
                toast.success("Info changed successfuly");
            }
            catch (error) {
                toast.error("Error");
                console.log(error);
            }
        }
        else {
            return;
        }
    };


    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button
                    type="button"
                    className="logOut"
                    onClick={() => onLogOutHandle()}
                >
                    Log Out
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            onChangeDetails();
                            isChangedDetails && onUpdateSubmit();
                        }}
                    >
                        {isChangedDetails ? "Done" : "Change"}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            name="displayName"
                            className={!isChangedDetails ? "profileName" : "profileNameActive"}
                            disabled={!isChangedDetails}
                            onChange={onChangeInput}
                            placeholder="Your name"
                            value={displayName}
                        />
                        <input
                            type="email"
                            name="email"
                            className={!isChangedDetails ? "profileEmail" : "profileEmailActive"}
                            disabled={!isChangedDetails}
                            onChange={onChangeInput}
                            placeholder="Your email"
                            value={email}
                        />
                    </form>
                </div>

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="go" />
                </Link>
            </main>
        </div>
    );
};

export default Profile;
