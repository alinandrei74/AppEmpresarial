import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Elimina BrowserRouter aquí
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { AuthContext } from "./contexts/AuthContext";
import Aside from "./pages/user_profile/components/Aside";
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} AppContent
 */
const AppContent = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { userData } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const location = useLocation();
  const isUserProfileRoute = location.pathname.includes("/user-profile");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      {isUserProfileRoute && (!isMobile || (isMobile && isMenuOpen)) && (
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
      {/* <SampleWebStyle /> */}
    </div>
  );
};

export default AppContent;
