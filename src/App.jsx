import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Swipe from "./screens/Swipe";
import Match from "./screens/Match";
import Closet from "./screens/Closet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Swipe />} />
        <Route path="/match" element={<Match />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </Router>
  );
}

export default App;
