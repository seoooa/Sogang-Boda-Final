import Logo from "../../assets/img/logo.svg";
import React from "react";
import styled from "styled-components";

function Header({ handleHome, handleMyInfo, handleLogOut }) {
  return (
    <Head>
      <ServiceImg onClick={handleHome} src={Logo} alt="Logo" />
      <ServiceNav>
        <h3 onClick={handleMyInfo}>My Page</h3>
        <h3 onClick={handleLogOut}>Log Out</h3>
      </ServiceNav>
    </Head>
  );
}

const Head = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 40px 26px 30px;
  align-items: center;
  justify-content: space-between;
`;

const ServiceImg = styled.img`
  cursor: pointer;
  height: 30px;
`;

const ServiceNav = styled.div`
  gap: 50px;
  display: flex;
  font-size: 20px; /* 예시 스타일 */
  color: #3a3a3b;
  cursor: pointer;
`;

export default Header;