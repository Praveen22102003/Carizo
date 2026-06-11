import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Register.css";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });
  const [imageFile, setImageFile] = useState(null);  // NEW
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // NEW: handle image selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData for multipart/form-data
      const formData = new FormData();
      formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Registration successful! You can now login.");
        setUser({
          username: "",
          email: "",
          password: "",
          role: "ROLE_USER",
        });
        setImageFile(null);  // reset file input

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        const data = await response.json();
        setMessage("Registration failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setMessage("Registration failed: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          required
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Vendor</option>
        </select>

        {/* NEW: optional profile image */}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
