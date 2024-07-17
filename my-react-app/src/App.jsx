import React, { useContext } from "react";
import "./App.css";
import RoleButtons from "./components/sample_colors/RoleButtons";
import ColorTable from "./components/sample_colors/ColorTable";
import { DarkModeContext } from "./contexts/DarkModeContext";
import PropTypes from "prop-types";

/**
 * Botón para cambiar entre modo claro y oscuro.
 *
 * @returns {JSX.Element} El botón de alternancia de modo.
 */
const ToggleButton = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <button className={"toggle-button"} onClick={toggleDarkMode}>
      Cambiar a modo {darkMode ? "claro" : "oscuro"}
    </button>
  );
};

ToggleButton.propTypes = {
  className: PropTypes.string,
};

/**
 * Componente principal de la aplicación.
 *
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
const App = () => {
  return (
    <main>
      <div className="app-container">
        <ToggleButton />
        <ColorTable />
        <ToggleButton />
        <RoleButtons />
      </div>
    </main>
  );
};

export default App;
