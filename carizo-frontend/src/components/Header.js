import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const profileImage = localStorage.getItem("profileImage");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (token && role === "ROLE_USER") {
      fetch(`/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCartCount(data.items?.length || 0);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [token, role]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  // New function to navigate home on logo click
  const goToHomepage = () => {
    navigate("/");
  };

  return (
    <header className="header">
      {/* Logo with image clickable */}
      <div
        className="logo"
        onClick={goToHomepage}
        style={{ cursor: "pointer" }}
      >
        <img src="/logo.png" alt="Carizo Logo" height="50" />
      </div>

      <form onSubmit={handleSearchSubmit} className="header-search-form">
        <input
          type="text"
          placeholder="Search categories or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="header-search-input"
        />
        <button type="submit" className="header-search-button">
          Search
        </button>
      </form>

      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/categories">Categories</Link>
          </li>

          {!token ? (
            <li className="dropdown" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <FaUser size={22} />
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-link"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-link"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li className="greeting dropdown" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="dropdown-toggle">
                  <img
                    src={profileImage || "/images/logo.jpg"}
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <span className="username-text">
                    Hello, {username} &#x25BC;
                  </span>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="dropdown-link"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="logout-button dropdown-link"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {role === "ROLE_ADMIN" && (
                <>
                  <li>
                    <Link to="/admin/dashboard">Vendor Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/all">All Orders</Link>
                  </li>
                </>
              )}

              {role === "ROLE_USER" && (
                <>
                  <li>
                    <Link to="/my">My Orders</Link>
                  </li>
                  <li className="cart-icon">
                    <Link to="/cart">
                      <FaShoppingCart size={22} />
                      {cartCount > 0 && (
                        <span className="cart-count">{cartCount}</span>
                      )}
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
