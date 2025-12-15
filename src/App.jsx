import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import PhoneCanvas from "./components/PhoneCanvas";

import Swipe from "./screens/Swipe";
import Match from "./screens/Match";
import Closet from "./screens/Closet";

function Layout() {
  return (
    <PhoneCanvas>
      <Outlet />
    </PhoneCanvas>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/swipe" replace />} />

          <Route path="/swipe" element={<Swipe />} />
          <Route path="/match" element={<Match />} />
          <Route path="/closet" element={<Closet />} />
        </Route>
      </Routes>
    </Router>
  );
}
