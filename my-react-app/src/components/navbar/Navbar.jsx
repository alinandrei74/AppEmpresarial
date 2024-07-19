import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import RoleButton from "../../utilities/components/RoleButton";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderRoleButtons = () => {
    const roles = [
      { role: "cleaning", label: "Limpieza" },
      { role: "maintenance", label: "Mantenimiento" },
      { role: "delivery", label: "Reparto" },
      { role: "superUser", label: "Admin" },
    ];

    return roles.map(({ role, label }) => (
      <RoleButton
        key={role}
        theme="Default"
        role={role}
        label={label}
        size="0.5rem 1rem"
        onClick={() => console.log(label)}
      />
    ));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/user-profile/">
            <h1>Mi perfil</h1>
          </Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        {isLoggedIn && (
          <div className={`navbar-buttons ${isMenuOpen ? 'active' : ''}`}>
            {renderRoleButtons()}
          </div>
        )}
        <div className={`navbar-actions ${isMenuOpen ? 'active' : ''}`}>
          <button className="login-button" onClick={handleLoginLogout}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
          <button className="toggle-mode" onClick={toggleDarkMode}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}