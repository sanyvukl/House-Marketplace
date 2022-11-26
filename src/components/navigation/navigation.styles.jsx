import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavBarContainer = styled.footer`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 85px;
  background-color: #ffffff;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const NavBarNavigation = styled.nav`
  width: 100%;
  margin: 1.25em 0;
  padding: 1rem 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow-y: hidden;  
`;

export const NavigationItemTitle = styled.span`
  margin-top: 0.25rem;
  font-size: 18px;
  font-weight: 600;
  color: #8f8f8f;
`;
export const NavigationItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #8f8f8f;

  svg{
    fill: #8f8f8f;
    width: 38px;
    height: 38px;
  }

  &.active{
      ${NavigationItemTitle}{
          color: #2c2c2c;
      }
      svg{
        fill: #2c2c2c;
      }
  }
`;

