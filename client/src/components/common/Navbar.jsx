import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoSVG } from '../../assets/icons/Logo.svg';
import AuthModal from '../auth/AuthModal';
import { getLogout } from '../../api/Auth';

function Button({ children, isActive, onClick }) {
  return (
    <NavButton isActive={isActive} onClick={onClick}>
      {children}
    </NavButton>
  );
}

function Navbar() {
  const [activeButton, setActiveButton] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = localStorage.getItem('로그인');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setShowModal(false);
  };

  const handleLogoClick = () => {
    setActiveButton(null); // StyledLogo를 클릭하면 activeButton을 초기화합니다.
    setShowModal(false);
  };

  const handleLoginClick = () => {
    setShowModal(true);
  };

  // const handleLogoutClick = async () => {
  //   try {
  //     await getLogout();
  //     setIsLoggedIn(false);
  //     navigate('/');
  //   } catch (error) {
  //     console.error('로그아웃 오류:', error);
  //   }
  // };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <GlobalStyle />
      <NavbarWrapper>
        <NavbarContainer>
          <LogoContainer to={'/'} onClick={handleLogoClick}>
            <StyledLogo />
          </LogoContainer>
          <ButtonContainer>
            <Link to={'/library'}>
              <Button
                isActive={activeButton === 'library'}
                onClick={() => handleButtonClick('library')}
              >
                도서관찾기
              </Button>
            </Link>
            <Link to={'/board'}>
              <Button
                isActive={activeButton === 'board'}
                onClick={() => handleButtonClick('board')}
              >
                게시판
              </Button>
            </Link>
            <Link to={'/mypage'}>
              <Button
                isActive={activeButton === 'mypage'}
                onClick={() => handleButtonClick('mypage')}
              >
                마이페이지
              </Button>
            </Link>

            {isLoggedIn ? (
              <Button onClick={handleLogoutClick}>로그아웃</Button>
            ) : (
              <Button onClick={handleLoginClick}>로그인</Button>
            )}
          </ButtonContainer>
        </NavbarContainer>
      </NavbarWrapper>
      {showModal && (
        <AuthModal onClose={handleCloseModal} initialFormType='로그인' />
      )}
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
  }
`;

const NavbarWrapper = styled.div`
  width: 100%; /* 네브바가 전체 너비를 차지하도록 설정 */
  box-sizing: border-box; /* 패딩과 테두리를 포함한 너비 계산 */
  border-bottom: 1px solid #e7e7e7; /* 더 얇은 선 */
  margin: 0; /* 모든 마진 제거 */
  padding: 25px 0px 35px 0px;
`;

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 70px;
`;

const LogoContainer = styled(Link)`
  margin-right: auto;
  margin-top: 10px;
`;

const StyledLogo = styled(LogoSVG)`
  width: 210px;
  height: 58.48px;
`;

const NavButton = styled.button`
  font-family: 'SUITE';
  font-style: normal;
  font-weight: ${({ isActive }) => (isActive ? '700' : '400')};
  font-size: 18px;
  line-height: 16px;
  text-align: center;
  color: #543d20;
  border: none;
  background-color: transparent;
  margin: 0 15px;
  cursor: pointer;

  &:hover {
    font-weight: 700;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

export default Navbar;
