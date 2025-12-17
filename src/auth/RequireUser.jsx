import React from "react";
import { Navigate } from "react-router-dom";
import { useUserSession } from "./UserSession";

export default function RequireUser({ children }) {
  const { isLoggedIn } = useUserSession();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}
