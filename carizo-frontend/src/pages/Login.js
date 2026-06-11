import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";  // import the CSS here

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then(data => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username); 
        localStorage.setItem("email", email);
        // Corrected field name here:
        localStorage.setItem(
          "profileImage",
          data.profileImageUrl || "/images/logo.jpg",
        );
        localStorage.setItem("userId", data.userId.toString());  // Store userId as string
        
        navigate("/");
      })
      .catch(err => {
        setError("Invalid email or password");
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="login-error">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
