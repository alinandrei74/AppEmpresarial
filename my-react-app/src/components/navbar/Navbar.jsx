import React, { useContext, useState } from "react";
import "./Navbar.css";
import { DarkModeContext } from "../../contexts/DarkModeContext";

/**
 ** Componente de barra de navegación que incluye botones de acción y de cambio de modo oscuro.
 *
 * @returns {JSX.Element} La barra de navegación.
 */
export default function Navbar() {
  // El nombre del componente debe coincidir con la importación
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   ** Maneja el evento de login/logout alternando el estado de `isLoggedIn`.
   */
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Mi perfil</h1>
        </div>
        {isLoggedIn && (
          <div className="navbar-buttons">
            <button className="navbar-button cleaning">Limpieza</button>
            <button className="navbar-button maintenance">Mantenimiento</button>
            <button className="navbar-button delivery">Reparto</button>
            <button className="navbar-button superUser">Manager</button>
          </div>
        )}
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
