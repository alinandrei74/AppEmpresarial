import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Aside.css";
import {
  FaTasks,
  FaStickyNote,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsersCog,
} from "react-icons/fa";

/**
 * Componente Aside para la navegación lateral.
 * @param {Object} props - Recibe el estado del menú del Navbar y los datos del usuario
 * @returns {JSX.Element} Componente Aside
 */
const Aside = ({ isMenuOpen, toggleMenu, userData }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false); // Estado para detectar si es móvil

  // Detectar cambios de tamaño de ventana para actualizar isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Si el ancho de la ventana es <= 768px, es móvil
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Inicialmente comprobar el tamaño de la ventana

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  if (userData?.role === "admin") {
    menuItems.push({
      name: "Gestión de usuarios",
      path: "/user-profile/user-management",
      icon: <FaUsersCog />,
    });
  }

  return (
    <aside className={`aside ${isMenuOpen || !isMobile ? "open" : ""}`}>
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
  );
};

export default Aside;
