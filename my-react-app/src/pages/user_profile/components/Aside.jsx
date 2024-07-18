import React from "react";
import { Link } from "react-router-dom";
import "./Aside.css";

/**
 * Componente de barra lateral que contiene los enlaces de navegación del perfil de usuario.
 * @component
 * @returns {JSX.Element} Aside
 */
const Aside = () => {
  const menuItems = [
    { name: "Tasks", path: "/user-profile/tasks" },
    { name: "Notes", path: "/user-profile/notes" },
    { name: "Calendar", path: "/user-profile/calendar" },
    { name: "Tourist Places", path: "/user-profile/tourist-places" },
  ];

  return (
    <aside className="aside">
      <div className="logo">Mi Aplicación</div>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Aside;
