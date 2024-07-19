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
    { name: "Tasks", path: "tasks" },
    { name: "Notes", path: "notes" },
    { name: "Calendar", path: "calendar" },
    { name: "Tourist Places", path: "tourist-places" },
  ];

  return (
    <aside className="aside">
      <div className="logo">Mi Aplicación</div>
      <ul className="aside-items">
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
