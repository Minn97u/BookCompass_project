import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Intro from './pages/Intro';
import Board from './pages/Board';
import Mypage from './pages/Mypage';
import Main from './pages/Main';
import LibraryInfo from './pages/LibraryInfo';
import EditPage from './pages/EditPage';
import AddInfo from './pages/AddInfo';
import NotFoundPage from './pages/NotFoundPage';
import { getLoginStatus } from './api/Auth';
import PostDetails from './pages/PostDetails';

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    try {
      await getLoginStatus();
    } catch (error) {
      if (location.pathname.startsWith('/mypage')) {
        navigate('/404');
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Intro />} />
            <Route path='library' element={<Main />} />
            <Route path='library/info' element={<LibraryInfo />} />
            <Route path='board/:shortId' element={<PostDetails />} />
            <Route path='board' element={<Board />} />
            <Route path='mypage' element={<Mypage />} />

            <Route path='mypage/edit' element={<EditPage />} />
            <Route path='*' element={<Navigate to='/404' />} />
          </Route>
          <Route path='/additionalinfo' element={<AddInfo />} />
          <Route path='/404' element={<NotFoundPage />} />
        </Routes>
      </QueryClientProvider>
    </div>
  );
};

const WrappedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
