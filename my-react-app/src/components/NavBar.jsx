import React, { useContext, useState } from 'react';
// Importamos React y los hooks que vamos a utilizar

import './NavBar.css';
// Importamos los estilos específicos para este componente

import { DarkModeContext } from '../contexts/DarkModeContext';
// Importamos el contexto del modo oscuro que creamos anteriormente

export default function NavBar() {
  // Definimos el componente NavBar como una función

  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  // Utilizamos useContext para acceder al estado del modo oscuro y la función para cambiarlo

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Creamos un estado local para controlar si el usuario ha iniciado sesión

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  // Función para manejar el inicio/cierre de sesión. Cambia el estado de isLoggedIn

  return (
    <nav className={`navbar ${darkMode ? 'dark-mode' : ''}`}>
      {/* La clase 'dark-mode' se añade condicionalmente basada en el estado darkMode */}
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Mi perfil</h1>
        </div>
        {isLoggedIn && (
          // Este bloque solo se renderiza si isLoggedIn es true
          <div className="navbar-buttons">
            <button className="navbar-button cleaning">Limpieza</button>
            <button className="navbar-button maintenance">Mantenimiento</button>
            <button className="navbar-button delivery">Reparto</button>
            <button className="navbar-button superUser">Manager</button>
          </div>
        )}
        <div className="navbar-actions">
          <button className="login-button" onClick={handleLoginLogout}>
            {isLoggedIn ? 'Logout' : 'Login'}
            {/* El texto del botón cambia dependiendo del estado de isLoggedIn */}
          </button>
          <button className="toggle-mode" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
            {/* El icono cambia dependiendo del estado de darkMode */}
          </button>
        </div>
      </div>
    </nav>
  );
}