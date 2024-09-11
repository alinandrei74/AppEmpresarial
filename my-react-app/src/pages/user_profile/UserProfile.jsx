import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import UserDetails from "./components/UserDetails"; //; Importa el nuevo componente
import "./UserProfile.css";
import { verifyToken } from "../../data_base/mockDatabase.mjs"; //; Importa la función para verificar el token

/**
 * Componente de perfil de usuario que maneja la navegación entre diferentes secciones.
 * Renderiza diferentes vistas y estilos según el rol del usuario.
 * @component
 * @returns {JSX.Element} UserProfile
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation(); //; Hook para obtener la ubicación actual
  const [userData, setUserData] = useState(null); //; Estado para almacenar los datos del usuario

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    //; Verificar el token utilizando la API simulada
    const result = verifyToken(token);

    if (result.status === 401 || result.status === 403) {
      //; Si el token ha caducado o es inválido, redirigir al login
      console.warn(result.message);
      alert(result.message);
      navigate("/login");
    } else if (result.status === 200) {
      //; Si el token es válido, almacenar los datos del usuario autenticado
      console.log("Todos los datos del usuario autenticado:", result.data);
      setUserData(result.data);
    } else {
      console.warn("Error desconocido al verificar el token.");
      alert("Ha ocurrido un error. Por favor, intente de nuevo.");
      navigate("/login");
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
