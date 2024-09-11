import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { DarkModeContext } from "../../../contexts/DarkModeContext";
import RoleButton from "../../../utilities/components/RoleButton";

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
      { role: "admin", label: "Admin" },
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
        {/* Menú hamburguesa a la izquierda */}
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>

        {/* Logo en el centro para pantallas grandes, dentro del menú para móviles */}
        <div className={`navbar-logo ${isMenuOpen ? 'menu-item' : ''}`}>
          <Link to="/user-profile">
            <h1>Mi perfil</h1>
          </Link>
        </div>

        {/* Menú desplegable con los botones de rol */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {isLoggedIn && renderRoleButtons()}
        </div>

        {/* Botones de acción siempre a la derecha */}
        <div className="navbar-actions">
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