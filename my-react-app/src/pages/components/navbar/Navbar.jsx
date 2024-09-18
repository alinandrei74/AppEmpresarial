import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify"; // Importa react-toastify para notificaciones
import "./Navbar.css";
import { DarkModeContext } from "../../../contexts/DarkModeContext";
import { FaUserCircle } from "react-icons/fa"; // Importa el ícono de perfil

/**
 * Componente de navegación principal.
 * @param {Object} props - Recibe el estado del menú del Aside
 * @returns {JSX.Element} Componente Navbar
 */
export default function Navbar({ isMenuOpen, toggleMenu }) {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
    toast.success("¡Has cerrado sesión correctamente!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* El ícono de menú ahora también controla el Aside */}
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>

        <div className={`navbar-logo ${isMenuOpen ? "menu-item" : ""}`}>
          <Link to="/user-profile">
            <FaUserCircle className="profile-icon" />
            <h1>Mi perfil</h1>
          </Link>
        </div>

        <div className="navbar-actions">
          {isLoggedIn && (
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          )}
          <button className="toggle-mode" onClick={toggleDarkMode}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
