import React, { useState } from "react";
import "./App.css";
import RoleButtons from "./components/RoleButtons";

/**
 * Componente principal de la aplicación.
 *
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  /**
   * Maneja el cambio entre modos claro y oscuro.
   */
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="app-container">
      <button className="toggle-button" onClick={toggleDarkMode}>
        Cambiar a modo {darkMode ? "claro" : "oscuro"}
      </button>
      <RoleButtons />
    </div>
  );
};

export default App;
