import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import UserProfile from "./user_profile/UserProfile";
import Register from "./register/Register";
import NotFound from "./not_found/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user-profile/*" element={<UserProfile />} />
      <Route
        path="/user-profile/admin/*"
        element={<UserProfile role="admin" />}
      />
      <Route
        path="/user-profile/cleaning/*"
        element={<UserProfile role="cleaning" />}
      />
      <Route
        path="/user-profile/delivery/*"
        element={<UserProfile role="delivery" />}
      />
      <Route
        path="/user-profile/maintenance/*"
        element={<UserProfile role="maintenance" />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
