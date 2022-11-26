import React, { Fragment, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Offers from "./routes/Offers/offers.component";
import Explore from "./routes/Explore/explore.component";
import Profile from "./routes/Profile/profile.component";
import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";
import ForgotPassword from "./components/forgot-password/forgot-password";
import Navigation from "./components/navigation/navigation.component";
import PrivateRoute from "./components/private-route/private-route.component";
import Category from "./components/category/category.component";
import CreateListing from "./components/create-listing/create-listing.component";

import { useContext } from "react";
import { UserContext } from "./context/user/user.context";
import { getCurrentUser } from "./utils/firebase/firebase.utils";
import { CategoryContext } from "./context/category/category.context";
import { getCategoryAndDocuments } from "./utils/firebase/firebase.utils";

const App = () => {
  const { setCurrentUser } = useContext(UserContext);
  const { setListings } = useContext(CategoryContext);

  useEffect(() => {
    const getUserData = async () => {
      const unsubscribe = await getCurrentUser();
      setCurrentUser(unsubscribe);
    };
    getUserData();
  }, []);

  useEffect(() => {
    const getListingData = async() =>{
      const listings = await getCategoryAndDocuments();
      setListings(listings);
    }
    getListingData();
  },[]);

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index={true} element={<Explore />} />
          <Route path="category/:categoryName" element={<Category />} />
          <Route path="offers" element={<Offers />} />
          <Route path="profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Fragment>
  );
};

export default App;
