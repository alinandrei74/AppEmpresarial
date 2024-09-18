<<<<<<< HEAD
import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes"; //; Importar el componente de rutas
import { DarkModeContext } from "./contexts/DarkModeContext"; //; Importar contexto de DarkMode
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";
import { resetAllTablesToDefaults } from "./data_base/mockDatabase.mjs"; //; Importa la función para verificar el token
=======
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom"; // Asegúrate de que el Router está aquí
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes"; // Importar el componente de rutas
import { DarkModeContext } from "./contexts/DarkModeContext"; // Importar contexto de DarkMode
import Aside from "./pages/user_profile/components/Aside"; // Importar el componente Aside para el menú lateral
>>>>>>> 4f7d37df6a05805632dd058eebc0374e3392c09e

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} App
 */
<<<<<<< HEAD
const App = () => {
  const { darkMode } = useContext(DarkModeContext); //; Usar el contexto de modo oscuro
=======
const AppContent = () => {
  const { darkMode } = useContext(DarkModeContext); // Usar el contexto de modo oscuro
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú lateral

  /**
   * Función que alterna el estado del menú desplegable.
   * @function
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abierto y cerrado
  };

  // Este hook de ubicación ahora está dentro del Router
  const location = useLocation();

  /**
   * Función para verificar si estamos en una ruta que incluya "/user-profile"
   * @function
   * @returns {boolean} true si la ruta actual incluye "/user-profile"
   */
  const isUserProfileRoute = location.pathname.includes("/user-profile");
>>>>>>> 4f7d37df6a05805632dd058eebc0374e3392c09e

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />{" "}
      {/* Navbar que comparte el estado del menú */}
      {/* Mostrar Aside solo en rutas de perfil de usuario */}
      {isUserProfileRoute && (
        <Aside isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      )}
      <div className="app">
        <main>
          <div className="app-container">
            <AppRoutes />
          </div>
        </main>
      </div>
      {/* ToastContainer montado en App, con tema dinámico */}
      <ToastContainer
        theme={darkMode ? "light" : "dark"}
        position="bottom-right" // Posición abajo a la derecha
        autoClose={3000} // Cierre automático después de 1.5 segundos
        hideProgressBar // Ocultar barra de progreso
        newestOnTop={false} // Las notificaciones nuevas se muestran en la parte inferior
        closeButton={false} // Ocultar el botón de cierre ("x")
        closeOnClick={false} // No cerrar al hacer clic en la notificación
        rtl={false} // No usar la dirección de derecha a izquierda
        pauseOnFocusLoss // Pausar la notificación al perder el foco
        draggable // Habilitar arrastre para eliminar la notificación
        pauseOnHover // Pausar al pasar el ratón por encima
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
