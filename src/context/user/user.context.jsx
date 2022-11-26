import { createContext } from "react";
import { useState, useEffect } from "react";
import {
    onAuthStateChangedListener,
    signInUserWithEmailAndPassword,
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    createAuthUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
import { updateUserDocument, updateUserProfile } from "../../utils/firebase/firebase.utils";

import { toast } from "react-toastify";
import { signOutUser } from "../../utils/firebase/firebase.utils";

export const UserContext = createContext({
    currentUser: null,
    isUserLoading: null,
    setCurrentUser: () => null,
    setIsUserLoading: () => null,
    logOutUser: () => null,
    signInWithEmail: () => null,
    signInWithGoogle: () => null,
    signUpWithEmail: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [isLogged, setIsLogged] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (user) {
                try {
                    await createUserDocumentFromAuth(user);
                    setCurrentUser(user);
                    console.log("User UseEffect fired");
                } catch (error) {
                    toast.error("Incorrect User Credentials");
                }
            }
        });
        return unsubscribe;
    }, []);

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
    const logOutUser = async () => {
        try {
            await signOutUser();
            setCurrentUser(null);
            setIsLogged(false);
            toast.success("Log Out Successfully");
        } catch (error) {
            toast.error("Incorrect User Credentials");
        }
    };
    const signInWithEmail = async (email, password) => {
        const { user } = await signInUserWithEmailAndPassword(email, password);
        setCurrentUser(user);
        setIsLogged(true);
    };
    const signInWithGoogle = async () => {
        try {
            const { user } = await signInWithGooglePopup();
            await createUserDocumentFromAuth(user);
            setCurrentUser(user);
            setIsLogged(true);
            toast.success("Signed In Succesfully");
        } catch (error) {
            checkErrors(error);
        }
    };
    const signUpWithEmail = async (email, password, additionalInfo = {}) => {
        const { user } = await createAuthUserWithEmailAndPassword(email, password);
        await createUserDocumentFromAuth(user, additionalInfo);
        // await updateProfile(user, additionalInfo);
        toast.success("Signed Up Succesfully");
        await signInWithEmail(email, password);
    };
    const updateUserData = async (update = {}) => {
        if (!currentUser) return;
        await updateUserProfile(currentUser, update);
        await updateUserDocument(currentUser.uid, update);
    };

    const value = { currentUser, isLogged, isUserLoading, setIsUserLoading, setCurrentUser, logOutUser, signInWithEmail, signInWithGoogle, signUpWithEmail, updateUserData };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
