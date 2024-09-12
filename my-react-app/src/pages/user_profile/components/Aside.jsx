import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Aside.css";

/**
 * Componente de barra lateral que contiene los enlaces de navegación del perfil de usuario.
 * @component
 * @returns {JSX.Element} Aside
 */
const Aside = () => {
  const location = useLocation(); //; Hook para obtener la ubicación actual
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
        {menuItems.map((item, index) => {
          //; Determinar si la ruta actual coincide con la ruta del elemento
          const isActive = location.pathname.includes(item.path);
          return (
            <li key={index}>
              <Link
                to={item.path}
                className={isActive ? "active-link" : ""}
                style={{
                  backgroundColor: isActive
                    ? "var(--clr-OnSecondary)" //; Usar el color secundario oscuro para el elemento activo
                    : "transparent",
                  color: isActive
                    ? "var(--clr-OnText)"
                    : "var(--clr-OnBackground)",
                }}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Aside;
