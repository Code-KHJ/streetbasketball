import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from '@components/common/Header';
import CreateGame from '@pages/CreateGame';
import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import Footer from './components/common/Footer';
import Mypage from './pages/Mypage';

function App() {
  const { user } = useUser();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (user.id == null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [user]);

  const { Kakao } = window;
  if (!Kakao.isInitialized()) {
    Kakao.init(`${process.env.REACT_APP_KAKAO_JS_API_KEY}`);
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<GameList />}></Route>
        <Route
          path="/create"
          element={user.id == null ? <Navigate to="/" /> : <CreateGame />}
        ></Route>
        <Route path="/detail" element={<GameDetail />}></Route>
        <Route
          path="/mypage"
          element={<Mypage />}
          // element={user.id == null ? <Navigate to="/" /> : <Mypage />}
        ></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
