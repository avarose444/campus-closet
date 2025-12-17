import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import PhoneCanvas from "./components/PhoneCanvas";

import Swipe from "./screens/Swipe";
import Match from "./screens/Match";
import Closet from "./screens/Closet";
import Login from "./screens/Login";

import { UserSessionProvider } from "./auth/UserSession";
import RequireUser from "./auth/RequireUser";

function Layout() {
  return (
    <PhoneCanvas>
      <Outlet />
    </PhoneCanvas>
  );
}

export default function App() {
  return (
    <UserSessionProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* First page of the app */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/swipe"
              element={
                <RequireUser>
                  <Swipe />
                </RequireUser>
              }
            />
            <Route
              path="/match"
              element={
                <RequireUser>
                  <Match />
                </RequireUser>
              }
            />
            <Route
              path="/closet"
              element={
                <RequireUser>
                  <Closet />
                </RequireUser>
              }
            />
          </Route>
        </Routes>
      </Router>
    </UserSessionProvider>
  );
}
