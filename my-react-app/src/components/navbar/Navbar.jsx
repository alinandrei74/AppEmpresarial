import React, { useContext, useState } from "react";
import "./Navbar.css";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import RoleButton from "../../utilities/components/RoleButton";

/**
 *1/ Componente de barra de navegación que incluye botones de acción y de cambio de modo oscuro.
 *
 * @returns {JSX.Element} La barra de navegación.
 */
export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   ** Maneja el evento de login/logout alternando el estado de `isLoggedIn`.
   */
  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  /**
   *2/ Renderiza los botones de rol cuando el usuario está logueado.
   *
   * @returns {JSX.Element} Los botones de rol.
   */
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
    <nav className={`navbar`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Mi perfil</h1>
        </div>
        {isLoggedIn && (
          <div className="navbar-buttons">{renderRoleButtons()}</div>
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
