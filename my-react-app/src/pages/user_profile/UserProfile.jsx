import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Importar AuthContext
import UserDetails from "./components/profile/UserDetails";
import Tasks from "./components/task/Tasks";
import Notes from "./components/notes/Notes";
import Calendar from "./components/calendar/Calendar";
import Apartments from "./components/apartments/Apartments";
import UserManagement from "./components/user_management/UserManagement";
import "./UserProfile.css";

const UserProfile = () => {
  const { userData } = useContext(AuthContext); // Obtener userData del contexto
  const location = useLocation();

  if (!userData) return null; // Si no hay datos del usuario, no renderizar

  return (
    <div className="user-profile-content">
      {location.pathname === "/user-profile" && (
        <UserDetails userData={userData} />
      )}

      {userData.role === "admin" && (
        <Routes>
          <Route
            path="user-management"
            element={<UserManagement userData={userData} />}
          />
        </Routes>
      )}

      <Routes>
        <Route path="tasks" element={<Tasks userData={userData} />} />
        <Route path="notes" element={<Notes userData={userData} />} />
        <Route path="calendar" element={<Calendar userData={userData} />} />
        <Route path="apartments" element={<Apartments userData={userData} />} />
      </Routes>
    </div>
  );
};

export default UserProfile;
