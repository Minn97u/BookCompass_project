// import React from 'react';
// import './index.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/common/Navbar';
// import Intro from './pages/Intro';
// import Board from './components/board/Board';
// import Mypage from './pages/Mypage';
// import Main from './pages/Main';
// import EditPage from './pages/EditPage';
// import AddInfo from './pages/AddInfo';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className='App'>
//         <Navbar />
//         <Routes>
//           <Route path='/' element={<Intro />} />
//           <Route path='/library' element={<Main />} />
//           <Route path='/board' element={<Board />} />
//           <Route path='/mypage' element={<Mypage />} />
//           <Route path='/mypage/edit' element={<EditPage />} />
//           <Route path='/additionalinfo' element={<AddInfo />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Intro from './pages/Intro';
import Board from './components/board/Board';
import Mypage from './pages/Mypage';
import Main from './pages/Main';
import EditPage from './pages/EditPage';
import AddInfo from './pages/AddInfo';

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/additionalinfo'];

  return (
    <div className='App'>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/library' element={<Main />} />
        <Route path='/board' element={<Board />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/mypage/edit' element={<EditPage />} />
        <Route path='/additionalinfo' element={<AddInfo />} /> {/* 경로 수정 */}
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
