import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import { SocketContext, socket } from "./utils/socket";

function App() {
  return (
    <SocketContext.Provider value={socket}><BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter></SocketContext.Provider>
  );
}

export default App;
