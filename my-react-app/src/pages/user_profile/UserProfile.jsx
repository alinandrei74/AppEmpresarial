import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import UserDetails from "./components/UserDetails"; //; Importa el nuevo componente
import "./UserProfile.css";
import {
  verifyToken,
  resetAllTablesToDefaults,
} from "../../data_base/mockDatabase.mjs"; //; Importa la función para verificar el token

/**
 * Componente de perfil de usuario que maneja la navegación entre diferentes secciones.
 * Renderiza diferentes vistas y estilos según el rol del usuario.
 * @component
 * @returns {JSX.Element} UserProfile
 */
const UserProfile = () => {
  // resetAllTablesToDefaults(); //! Resetear por defecto todas las tablas (debug)
  const navigate = useNavigate();
  const location = useLocation(); //; Hook para obtener la ubicación actual
  const [userData, setUserData] = useState(null); //; Estado para almacenar los datos del usuario

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const verificationResult = verifyToken(token); //; Cambiamos el nombre para reflejar mejor que es un resultado de verificación

    //; Verificar el resultado de la verificación del token
    if (
      verificationResult.status === 401 ||
      verificationResult.status === 403
    ) {
      console.warn(verificationResult.message);
      alert(verificationResult.message);
      navigate("/login"); //; Redirige al usuario al login si el token no es válido o ha caducado
    } else if (verificationResult.status === 200) {
      console.log(
        "Todos los datos del usuario autenticado:",
        verificationResult.data
      );
      setUserData(verificationResult.data); //; Almacena los datos del usuario autenticado
    } else {
      console.error("Error inesperado al verificar el token.");
      navigate("/login"); //; Redirige al usuario al login si ocurre un error inesperado
    }
  }, [navigate]);

  if (!userData) return null; //; Muestra nada hasta que los datos del usuario sean verificados

  return (
    <div className="user-profile-container">
      <Aside />
      <div className={`user-profile-content`}>
        {/* Renderiza UserDetails solo si la ruta es exactamente /user-profile */}
        {location.pathname === "/user-profile" && (
          <UserDetails userData={userData} />
        )}

        <Routes>
          <Route path="tasks" element={<Tasks role={userData.role_name} />} />
          <Route path="notes" element={<Notes role={userData.role_name} />} />
          <Route
            path="calendar"
            element={<Calendar role={userData.role_name} />}
          />
          <Route
            path="tourist-places"
            element={<TouristPlaces role={userData.role_name} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
