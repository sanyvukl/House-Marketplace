import { createContext, useState, useEffect, useReducer } from "react";
import {
    onAuthStateChangedListener,
    signInUserWithEmailAndPassword,
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    createAuthUserWithEmailAndPassword,
    updateUserDocument,
    updateUserProfile,
    signOutUser,
    getUser,
    sendPasswordReset,
} from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";

import { createAction } from "../../utils/reducer/reducer.utils"

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

const USER_ACTION_TYPES = {
    SET_CURRENT_USER: "user/SET_CURRENT_USER",
    SEND_USER_PASSWORD_RESET: "user/SEND_USER_PASSWORD_RESET",
}
const USER_INITIAL_STATE = {
    currentUser: null,
}

const UserReducer = (state, action) => {
    console.log(action);
    const { type, payload } = action;

    switch (type) {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
            return { ...state, currentUser: payload }
        default:
            throw new Error(`Unhandled type ${type} in userReduser`);
    };
};

export const UserProvider = ({ children }) => {
    const [{ currentUser }, dispatch] = useReducer(UserReducer, USER_INITIAL_STATE);

    const setCurrentUser = (user) => {
        dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user))
    };
    const [isUserLoading, setIsUserLoading] = useState(false);

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
        setIsUserLoading(false);
    };
    const signInWithEmail = async (email, password) => {
        const { user } = await signInUserWithEmailAndPassword(email, password);
        setCurrentUser(user);
    };
    const signInWithGoogle = async () => {
        try {
            const { user } = await signInWithGooglePopup();
            await createUserDocumentFromAuth(user);
            setCurrentUser(user);
            toast.success("Signed In Succesfully");
        } catch (error) {
            checkErrors(error);
        }
    };
    const signUpWithEmail = async (email, password, additionalInfo = {}) => {
        const { user } = await createAuthUserWithEmailAndPassword(email, password);
        await createUserDocumentFromAuth(user, additionalInfo);
        toast.success("Signed Up Succesfully");
        await signInWithEmail(email, password);
    };
    const updateUserData = async (update = {}) => {
        if (!currentUser) return;
        await updateUserProfile(currentUser, update);
        await updateUserDocument(currentUser.uid, update);
    };
    const logOutUser = async () => {
        try {
            await signOutUser();
            setCurrentUser(null);
            toast.success("Log Out Successfully");
        } catch (error) {
            toast.error("Incorrect User Credentials");
        }
    };

    const value = {
        currentUser, isUserLoading,
        setIsUserLoading, setCurrentUser,
        logOutUser, signInWithEmail,
        signInWithGoogle, signUpWithEmail,
        updateUserData,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChangedListener(async (user) => {
    //         if (user) {
    //             await createUserDocumentFromAuth(user);
    //         }
    //         setCurrentUser(user);
    //     });
    //     unsubscribe();
    // }, []);
