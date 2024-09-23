import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes";
import { DarkModeContext } from "./contexts/DarkModeContext";
import Aside from "./pages/user_profile/components/Aside";

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} App
 */
const AppContent = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado del menú hamburguesa
  const [isMobile, setIsMobile] = useState(false); // Estado para manejar si es móvil
  const [userData, setUserData] = useState(null); // Simular datos del usuario

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abrir/cerrar el menú
  };

  const location = useLocation();
  const isUserProfileRoute = location.pathname.includes("/user-profile");

  useEffect(() => {
    // Simular obtención de datos del usuario
    setUserData({
      role: "admin", // Simular usuario administrador
    });

    // Función para verificar el tamaño de la pantalla
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Detectar si es móvil (ancho <= 768px)
    };

    // Escuchar cambios de tamaño de la ventana
    window.addEventListener("resize", handleResize);
    handleResize(); // Ejecutar al cargar

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar efecto
    };
  }, []);

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      {/* Renderizar Aside solo si estamos en la ruta de perfil de usuario */}
      {isUserProfileRoute &&
        // Mostrar Aside solo en pantallas grandes o si el menú hamburguesa está abierto
        (!isMobile || (isMobile && isMenuOpen)) && (
          <Aside
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            userData={userData}
          />
        )}
      <div className="app">
        <main>
          <div className="app-container">
            <AppRoutes />
            {/* <SampleWebStyle /> */}
          </div>
        </main>
      </div>
      <ToastContainer
        theme={darkMode ? "light" : "dark"}
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeButton={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
