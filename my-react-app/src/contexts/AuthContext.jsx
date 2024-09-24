import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// Crear contexto de autenticación
export const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación.
 * Maneja la verificación del token y los datos del usuario.
 * @param {React.ReactNode} children - Componentes hijos que consumirán el contexto.
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token && location.pathname !== "/login") {
        handleInvalidToken("Token no encontrado. Por favor, inicia sesión.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/verify", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setUserData(result.data.user);
        } else {
          const result = await response.json();
          handleInvalidToken(result.message);
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        handleInvalidToken("Error al verificar el token. Intenta nuevamente.");
      }
    };

    // Verificar el token en cada cambio de ruta (excepto en "/login")
    if (location.pathname !== "/login") {
      verifyToken();
    }

    // Verificar el token cada 5 minutos
    const intervalId = setInterval(() => {
      if (location.pathname !== "/login") {
        verifyToken();
      }
    }, 300000); // 300000ms = 5 minutos

    return () => clearInterval(intervalId);
  }, [location.pathname, navigate]);

  const handleInvalidToken = (message) => {
    console.warn(message);
    toast.error(message);
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
