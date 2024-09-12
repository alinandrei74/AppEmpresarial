import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes"; // Importar el componente de rutas
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";
import { resetAllTablesToDefaults } from "./data_base/mockDatabase.mjs"; //; Importa la función para verificar el token

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} App
 */
const App = () => {
  // resetAllTablesToDefaults(); //! Resetear por defecto todas las tablas (debug)
  return (
    <Router>
      <Navbar />
      <div className="app">
        <main>
          <div className="app-container">
            <AppRoutes />
            {/* <SampleWebStyle /> */}
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
