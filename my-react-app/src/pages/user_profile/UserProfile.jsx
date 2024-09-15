import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
// import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import UserDetails from "./components/UserDetails";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    //; Verifica si el token existe
    if (!token) {
      alert("Token no encontrado. Por favor, inicia sesión.");
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        //; Realiza la petición al backend para verificar el token
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, //; Añade el token en el header de autorización
          },
        });

        const result = await response.json();

        if (response.status === 200) {
          console.log("Todos los datos del usuario autenticado:", result.data);
          setUserData(result.data);
        } else if (response.status === 401 || response.status === 403) {
          console.warn(result.message);
          alert(result.message);
          navigate("/login");
        } else {
          console.error("Error inesperado al verificar el token.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("Error al verificar el token. Por favor, intenta nuevamente.");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  if (!userData) return null;

  return (
    <div className="user-profile-container">
      <Aside />
      <div className="user-profile-content">
        {location.pathname === "/user-profile" && (
          <UserDetails userData={userData} />
        )}

        <Routes>
          <Route path="tasks" element={<Tasks userData={userData} />} />
          {/* <Route path="notes" element={<Notes userData={userData} />} /> */}
          <Route path="calendar" element={<Calendar userData={userData} />} />
          <Route
            path="tourist-places"
            element={<TouristPlaces userData={userData} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
