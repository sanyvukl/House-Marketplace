import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../../assets/svg/exploreIcon.svg";
import { ReactComponent as ProfileIcon } from "../../assets/svg/personOutlineIcon.svg";

import {
  NavBarContainer,
  NavBarNavigation,
  NavigationItem,
  NavigationItemTitle,
} from "./navigation.styles";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const handleClick = (path) => navigate(path);
  const isActive = (route) => (route === pathname ? true : false);

  return (
    <Fragment>
      <Outlet />
      <NavBarContainer>
        <NavBarNavigation>
          <NavigationItem
            className={isActive("/") && "active"}
            onClick={() => handleClick("/")}
          >
            <ExploreIcon />
            <NavigationItemTitle>Explore</NavigationItemTitle>
          </NavigationItem>

          <NavigationItem
            className={isActive("/offers") && "active"}
            onClick={() => handleClick("/offers")}
          >
            <OfferIcon />
            <NavigationItemTitle>Offers</NavigationItemTitle>
          </NavigationItem>

          <NavigationItem
            className={isActive("/profile") && "active"}
            onClick={() => handleClick("/profile")}
          >
            <ProfileIcon />
            <NavigationItemTitle>Profile</NavigationItemTitle>
          </NavigationItem>
        </NavBarNavigation>
      </NavBarContainer>
    </Fragment>
  );
};

export default Navigation;
