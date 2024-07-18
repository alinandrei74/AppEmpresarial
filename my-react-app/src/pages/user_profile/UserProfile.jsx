import React from "react";
import { Routes, Route } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import "./UserProfile.css";

/**
 * Componente de perfil de usuario que maneja la navegación entre diferentes secciones.
 * @component
 * @returns {JSX.Element} UserProfile
 */
const UserProfile = () => {
  return (
    <div className="user-profile-container">
      <Aside />
      <div className="user-profile-content">
        <Routes>
          <Route path="tasks" element={<Tasks />} />
          <Route path="notes" element={<Notes />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tourist-places" element={<TouristPlaces />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
