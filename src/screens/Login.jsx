import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrCreateUser } from "../firebase/users";
import { useUserSession } from "../auth/UserSession";
import "./Login.css";

import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUserSession();

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  React.useEffect(() => {
    if (isLoggedIn) navigate("/swipe", { replace: true });
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      const user = await getOrCreateUser(username);
      login(user);
      navigate("/swipe", { replace: true });
    } catch (err) {
      setStatus({ loading: false, error: err?.message || "Something went wrong." });
      return;
    }

    setStatus({ loading: false, error: "" });
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <img className="login-logo" src={logo} alt="App logo" />

        <p className="login-subtitle">
          Enter your username to continue.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={status.loading}
          />

          <button className="login-submit" type="submit" disabled={status.loading}>
            {status.loading ? "Checking..." : "Login"}
          </button>

          {status.error ? <div className="login-error">{status.error}</div> : null}
        </form>
      </div>
    </div>
  );
}
