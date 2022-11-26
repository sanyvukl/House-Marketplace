import styled from "styled-components";

export const NavigationItemTitle = styled.span`
  margin-top: 0.25rem;
  font-size: 18px;
  font-weight: 600;
  color: #8f8f8f;
`;
export const NavigationItemContainer = styled.div`
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