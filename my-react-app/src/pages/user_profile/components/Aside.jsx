import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Aside.css";
import {
  FaTasks,
  FaStickyNote,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsersCog, // Icono para UserManagement
} from "react-icons/fa"; // Importar iconos

/**
 * Componente Aside para la navegación lateral.
 * @param {Object} props - Recibe el estado del menú del Navbar y los datos del usuario
 * @returns {JSX.Element} Componente Aside
 */
const Aside = ({ isMenuOpen, toggleMenu, userData }) => {
  const location = useLocation();

  // Definir los items del menú
  const menuItems = [
    { name: "Tareas", path: "/user-profile/tasks", icon: <FaTasks /> },
    { name: "Notas", path: "/user-profile/notes", icon: <FaStickyNote /> },
    {
      name: "Calendario",
      path: "/user-profile/calendar",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Apartamentos",
      path: "/user-profile/apartments",
      icon: <FaMapMarkerAlt />,
    },
  ];

  // Si el usuario es admin, añadimos la opción de "Gestión de usuarios"
  if (userData?.role === "admin") {
    menuItems.push({
      name: "Gestión de usuarios",
      path: "/user-profile/user-management",
      icon: <FaUsersCog />,
    });
  }

  return (
    <>
      <aside className={`aside ${isMenuOpen ? "open" : ""}`}>
        <div className="logo"></div>
        <ul className="aside-items">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={isActive ? "active-link" : ""}
                  onClick={toggleMenu}
                >
                  {item.icon} {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default Aside;
