import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify"; //; Importa react-toastify para notificaciones
import "./Navbar.css";
import { DarkModeContext } from "../../../contexts/DarkModeContext";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const token = sessionStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Añadimos location como dependencia

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);

    // Muestra una notificación cuando el usuario cierra sesión
    toast.success("¡Has cerrado sesión correctamente!");

    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>

        <div className={`navbar-logo ${isMenuOpen ? "menu-item" : ""}`}>
          <Link to="/user-profile">
            <h1>Mi perfil</h1>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {/* Menú vacío por ahora */}
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
