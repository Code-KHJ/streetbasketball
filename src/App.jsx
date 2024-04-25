import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Header from "@components/common/Header";
import CreateGame from "@pages/CreateGame";
import GameList from "./pages/GameList";
import GameDetail from "./pages/GameDetail";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<GameList />}></Route>
        <Route path="/create" element={<CreateGame />}></Route>
        <Route path="/detail" element={<GameDetail />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
