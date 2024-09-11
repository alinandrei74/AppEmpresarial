import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import UserProfile from "./user_profile/UserProfile";
import Register from "./register/Register";
import NotFound from "./not_found/NotFound";

/**
 * Componente que maneja las rutas de la aplicación.
 * @component
 * @returns {JSX.Element} AppRoutes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta para el inicio de sesión */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Ruta para el registro de nuevos usuarios */}
      <Route path="/register" element={<Register />} />

      {/* Ruta general para el perfil de usuario */}
      <Route path="/user-profile/*" element={<UserProfile />} />

      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
