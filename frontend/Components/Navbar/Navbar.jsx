import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Sports Zaga</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/rentingStore">Renting</Link>
        </li>
        <li>
          <Link to="/">About</Link>
        </li>
      </ul>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <button className="profileButton" onClick={handleProfileClick}>
            <h4>Profile</h4>
          </button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
