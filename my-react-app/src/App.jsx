import React, { useContext } from "react";
import "./App.css";
import RoleButtons from "./components/RoleButtons";
import { DarkModeContext } from "./contexts/DarkModeContext";

/**
 *1/ Componente principal de la aplicación.
 *
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
const App = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

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
