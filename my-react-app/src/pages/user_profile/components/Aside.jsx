import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Aside.css";

const Aside = ({ userData }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Tasks", path: "tasks" },
    { name: "Notes", path: "notes" },
    { name: "Calendar", path: "calendar" },
    { name: "Tourist Places", path: "tourist-places" },
  ];

  // Añadir opciones solo para administradores
  if (userData && userData.role_name === "admin") {
    menuItems.push(
      { name: "Crear Perfil", path: "create-profile" },
      { name: "Gestión de Usuarios", path: "user-management" }
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>
      <aside className={`aside ${isMenuOpen ? 'open' : ''}`}>
        <div className="logo">Mi Aplicación</div>
        <ul className="aside-items">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={isActive ? "active-link" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
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