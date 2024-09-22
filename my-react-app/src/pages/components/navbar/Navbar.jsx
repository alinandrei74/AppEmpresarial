import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";
import { DarkModeContext } from "../../../contexts/DarkModeContext";
import { FaUserCircle } from "react-icons/fa";

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

  const isUserProfileActive = location.pathname.includes("/user-profile");

  // Verificar si estamos en la ruta /login
  const isLoginRoute = location.pathname === "/login";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Menú desplegable */}
        {isLoggedIn && isUserProfileActive && (
          <div className="menu-icon" onClick={toggleMenu}>
            ☰
          </div>
        )}

        {/* Logo "Mi perfil" solo si el usuario está logueado */}
        {isLoggedIn && (
          <div
            className={`navbar-logo ${!isUserProfileActive ? "no-margin" : ""}`}
          >
            <Link
              to="/user-profile"
              className={`${isUserProfileActive ? "active-link" : ""}`}
            >
              <FaUserCircle className="profile-icon" />
              <h1>Mi perfil</h1>
            </Link>
          </div>
        )}

        {/* Título principal */}
        <div
          className={`navbar-title ${!isLoggedIn ? "adjust-title" : ""} ${
            isLoginRoute && isLoggedIn ? "login-margin" : ""
          }`}
        >
          <h1>UNITYNET</h1>
        </div>

        {/* Botón de cerrar sesión */}
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
