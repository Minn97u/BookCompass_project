import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import { getLogout, getLoginStatus } from '../../api/Auth';
import RealLogo from '../../assets/icons/RealLogo.svg';

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
  const [loginText, setLoginText] = useState('로그인');
  const navigate = useNavigate();

  const handelLoginStatus = async () => {
    try {
      const res = await getLoginStatus();
      const logined = res.data.loggedIn;
      if (!logined) {
        setLoginText('로그인');
      } else {
        setIsLoggedIn(true);
        setLoginText('로그아웃');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  useEffect(() => {
    handelLoginStatus();
  }, []);

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'mypage') {
      if (!isLoggedIn) {
        setShowModal(true);
      } else {
        navigate('/mypage');
        setActiveButton(buttonName);
      }
    } else {
      setActiveButton(buttonName);
    }
  };

  const handleLogoClick = () => {
    setActiveButton(null); // StyledLogo를 클릭하면 activeButton을 초기화합니다.
    setShowModal(false);
  };

  const handleLoginClick = async () => {
    if (loginText === '로그인') {
      setShowModal(true);
    } else {
      try {
        await getLogout();
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRegion');
        localStorage.removeItem('favoriteAuthor');
        window.location.href = '/';
      } catch (error) {
        console.error('로그아웃 오류:', error);
      }
    }
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
            <LogoImg src={RealLogo} alt='logo' />
          </LogoContainer>
          <ButtonContainer>
            <Link to={'/library/info'}>
              <Button
                isActive={activeButton === 'libraryinfo'}
                onClick={() => handleButtonClick('libraryinfo')}
              >
                도서 정보
              </Button>
            </Link>
            <Link to={'/library'}>
              <Button
                isActive={activeButton === 'library'}
                onClick={() => handleButtonClick('library')}
              >
                도서관 찾기
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

            <Button
              isActive={activeButton === 'mypage' && isLoggedIn}
              onClick={() => handleButtonClick('mypage')}
            >
              마이페이지
            </Button>
            <Button onClick={handleLoginClick}>{loginText}</Button>
          </ButtonContainer>
        </NavbarContainer>
      </NavbarWrapper>
      {showModal && (
        <AuthModal onClose={handleCloseModal} initialFormType='로그인' />
      )}

      <Outlet />
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
  margin: 0; /* 모든 마진 제거 */
  padding: 10px 0px;
  box-shadow: 0 3px 5px rgba(189, 189, 189, 0.25);
  position: relative;
  z-index: 10;
`;

const LogoImg = styled.img`
  width: 13rem;
`;

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 50px 10px 70px;
`;

const LogoContainer = styled(Link)`
  margin-right: auto;
  margin-top: 10px;
`;

const NavButton = styled.button`
  font-family: 'S-CoreDream-4Regular';
  font-weight: ${({ isActive }) => (isActive ? '800' : '700')};
  font-size: 1rem;
  line-height: 16px;
  text-align: center;
  color: ${({ isActive }) => (isActive ? '#68533c' : '#464646')};
  border: none;
  background-color: transparent;
  margin: 0 15px;
  cursor: pointer;

  &:hover {
    font-weight: 700;
    color: #68533c;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

export default Navbar;
