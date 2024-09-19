import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Aside.css";
import {
  FaTasks,
  FaStickyNote,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa"; // Importar iconos

/**
 * Componente Aside para la navegación lateral.
 * @param {Object} props - Recibe el estado del menú del Navbar
 * @returns {JSX.Element} Componente Aside
 */
const Aside = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Tasks", path: "/user-profile/tasks", icon: <FaTasks /> },
    { name: "Notes", path: "/user-profile/notes", icon: <FaStickyNote /> },
    {
      name: "Calendar",
      path: "/user-profile/calendar",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Tourist Places",
      path: "/user-profile/tourist-places",
      icon: <FaMapMarkerAlt />,
    },
  ];

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
