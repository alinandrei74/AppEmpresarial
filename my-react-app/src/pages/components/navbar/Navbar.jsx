import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { toast } from "react-toastify"; //; Importa react-toastify para notificaciones
=======
import { toast } from "react-toastify"; // Importa react-toastify para notificaciones
>>>>>>> 4f7d37df6a05805632dd058eebc0374e3392c09e
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
<<<<<<< HEAD

    // Muestra una notificación cuando el usuario cierra sesión
    toast.success("¡Has cerrado sesión correctamente!");

=======
    toast.success("¡Has cerrado sesión correctamente!");
>>>>>>> 4f7d37df6a05805632dd058eebc0374e3392c09e
    navigate("/login");
  };

  // Verificar si estamos en la ruta exacta "/user-profile"
  const isUserProfileActive = location.pathname === "/user-profile";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>

        <div className={`navbar-logo ${isMenuOpen ? "menu-item" : ""}`}>
          <Link
            to="/user-profile"
            className={isUserProfileActive ? "active-link" : ""}
          >
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
