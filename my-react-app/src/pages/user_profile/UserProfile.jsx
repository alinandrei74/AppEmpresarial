import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/task/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import UserDetails from "./components/UserDetails";
import UserManagement from "./UserManagement";
import FloatingButton from "./components/FloatingButton";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      handleInvalidToken("Token no encontrado. Por favor, inicia sesión.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data.user;
          setUserData(userData);
          console.log("Todos los datos del usuario autenticado:", userData);
        } else {
          const result = await response.json();
          handleInvalidToken(result.message);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        handleInvalidToken(
          "Error al verificar el token. Por favor, intenta nuevamente."
        );
      }
    };

    verifyToken();
  }, [navigate]);

  const handleInvalidToken = (message) => {
    console.warn(message);
    alert(message);
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleCreateUser = () => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      '/register',
      'CreateUserWindow',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  };

  if (!userData) return null;

  return (
    <div className="user-profile-container">
      <Aside userData={userData} />
      <div className="user-profile-content">
        {location.pathname === "/user-profile" && (
          <UserDetails userData={userData} />
        )}

        <Routes>
          <Route path="tasks" element={<Tasks userData={userData} />} />
          <Route path="notes" element={<Notes userData={userData} />} />
          <Route path="calendar" element={<Calendar userData={userData} />} />
          <Route path="tourist-places" element={<TouristPlaces userData={userData} />} />
          {userData.role === 'admin' && (
            <Route path="user-management" element={<UserManagement currentUserId={userData.id} />} />
          )}
        </Routes>
      </div>
      {userData.role === 'admin' && (
        <FloatingButton onClick={handleCreateUser} />
      )}
    </div>
  );
};

export default UserProfile;