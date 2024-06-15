import React, { useState, useEffect } from 'react';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Intro from './pages/Intro';
import Board from './pages/Board';
import Mypage from './pages/Mypage';
import Main from './pages/Main';
import EditPage from './pages/EditPage';
import AddInfo from './pages/AddInfo';
import NotFoundPage from './pages/NotFoundPage';
import { getLoginStatus } from './api/Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const hideNavbarPaths = ['/additionalinfo', '/404'];

  const checkLoginStatus = async () => {
    try {
      await getLoginStatus();
    } catch (error) {
      console.log('로그인상태', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  return (
    <div className='App'>
      {!hideNavbarPaths.some((path) => location.pathname.startsWith(path)) && (
        <Navbar />
      )}
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/library' element={<Main />} />
        <Route path='/board' element={<Board />} />
        {isLoggedIn ? (
          <>
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/mypage/edit' element={<EditPage />} />
            <Route path='/mypage/additionalinfo' element={<AddInfo />} />
          </>
        ) : (
          <Route path='/mypage/*' element={<Navigate to='/404' />} />
        )}
        <Route path='/404' element={<NotFoundPage />} />
        <Route path='*' element={<Navigate to='/404' />} />
      </Routes>
    </div>
  );
};

const WrappedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
