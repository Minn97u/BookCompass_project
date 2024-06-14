import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Intro from './pages/Intro';
import Boards from './components/board/Boards';
import Mypage from './pages/Mypage';
import Main from './pages/Main';
import EditPage from './pages/EditPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='App'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path='/library' element={<Main />} />
          <Route path='/board' element={<Boards />} />
          <Route path='/mypage' element={<Mypage />} />
          <Route path='/mypage/edit' element={<EditPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
