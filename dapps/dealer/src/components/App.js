import React, { useState } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Player from "../pages/Player";
import Host from "../pages/Host";
import Home from "../pages/Home";
import "./App.css";
function App() {
  const [account, setAccount] = useState("");
  return (
    <div className="app-wrapper">
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home setAccount={setAccount} />} />
          <Route path="/player" element={<Player account={account} />} />
          <Route path="/host" element={<Host account={account} />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
