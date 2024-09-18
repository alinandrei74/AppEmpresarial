import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./pages/components/navbar/Navbar";
import AppRoutes from "./pages/AppRoutes"; //; Importar el componente de rutas
import { DarkModeContext } from "./contexts/DarkModeContext"; //; Importar contexto de DarkMode
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";
import { resetAllTablesToDefaults } from "./data_base/mockDatabase.mjs"; //; Importa la función para verificar el token

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} App
 */
const App = () => {
  const { darkMode } = useContext(DarkModeContext); //; Usar el contexto de modo oscuro

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

      {/* ToastContainer montado en App, con tema dinámico */}
      {/* <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}

      <ToastContainer
        theme={darkMode ? "light" : "dark"}
        position="bottom-right" //; Posición abajo a la derecha
        autoClose={1500} //; Cierre automático después de 3 segundos
        hideProgressBar //; Mostrar barra de progreso
        newestOnTop={false} //; Las notificaciones nuevas se muestran en la parte inferior
        closeButton={false} //; Ocultar el botón de cierre ("x")
        closeOnClick={false} //; No cerrar al hacer clic en la notificación
        rtl={false} //; No usar la dirección de derecha a izquierda
        pauseOnFocusLoss //; Pausar la notificación al perder el foco
        draggable //; Habilitar arrastre para eliminar la notificación
        pauseOnHover //; Pausar al pasar el ratón por encima
        // icon={false}
      />
    </Router>
  );
};

export default App;
