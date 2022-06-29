import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./Player";
import Host from "./Host";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/player" element={<Player />} />
            <Route path="/host" element={<Host />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
