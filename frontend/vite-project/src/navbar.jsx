import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">


        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/home">HOME</Link></li>

          {!isLoggedIn ? (
            <>
              <li><Link to="/login">LOGIN</Link></li>
              <li><Link to="/signup">SIGNUP</Link></li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                LOGOUT
              </button>
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;