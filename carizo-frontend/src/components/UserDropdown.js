import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserDropdown.css';

const UserDropdown = () => {
  return (
    <div className="user-dropdown">
      <Link to="/register" className="dropdown-item">Register</Link>
      <Link to="/login" className="dropdown-item">Login</Link>
    </div>
  );
};

export default UserDropdown;
