import React from "react";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import "./UserProfile.css";

/**
 * Componente de perfil de usuario que maneja la navegación entre diferentes secciones.
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.role - El rol del usuario.
 * @returns {JSX.Element} UserProfile
 */
const UserProfile = ({ role }) => {
  return (
    <div className="user-profile-container">
      <Aside />
      <div className="user-profile-content">
        <Routes>
          <Route path="tasks" element={<Tasks role={role} />} />
          <Route path="notes" element={<Notes role={role} />} />
          <Route path="calendar" element={<Calendar role={role} />} />
          <Route
            path="tourist-places"
            element={<TouristPlaces role={role} />}
          />
        </Routes>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  role: PropTypes.string,
};

export default UserProfile;
