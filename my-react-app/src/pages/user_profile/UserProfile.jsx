import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import "./UserProfile.css";
import { verifyToken } from "../../data_base/mockDatabase"; // Importa la función para verificar el token

/**
 * Componente de perfil de usuario que maneja la navegación entre diferentes secciones.
 * Renderiza diferentes vistas y estilos según el rol del usuario.
 * @component
 * @returns {JSX.Element} UserProfile
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const verifiedUser = verifyToken(token);

    if (!verifiedUser) {
      console.log("Token inválido o expirado.");
      navigate("/"); // Redirige a la página de login si el token es inválido
    } else {
      console.log("Datos del usuario autenticado:", verifiedUser);
      setUserData(verifiedUser); // Almacena los datos del usuario autenticado
    }
  }, [navigate]);

  if (!userData) return null; // Muestra nada hasta que los datos del usuario sean verificados

  return (
    <div className="user-profile-container">
      <Aside />
      <div className={`user-profile-content`}>
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
