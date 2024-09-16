import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";
import Calendar from "./components/Calendar";
import TouristPlaces from "./components/TouristPlaces";
import UserDetails from "./components/UserDetails";
import Register from "../register/Register";
import UserManagement from "./UserManagement";
import "./UserProfile.css";
import { verifyToken } from "../../data_base/mockDatabase.mjs";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const verificationResult = verifyToken(token);

    if (verificationResult.status === 401 || verificationResult.status === 403) {
      console.warn(verificationResult.message);
      alert(verificationResult.message);
      navigate("/login");
    } else if (verificationResult.status === 200) {
      console.log("Todos los datos del usuario autenticado:", verificationResult.data);
      setUserData(verificationResult.data);
    } else {
      console.error("Error inesperado al verificar el token.");
      navigate("/login");
    }
  }, [navigate]);

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
          {userData.role_name === "admin" && (
            <>
              <Route path="create-profile" element={<Register />} />
              <Route path="user-management" element={<UserManagement currentUserId={userData.user_id} />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;