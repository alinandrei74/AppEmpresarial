import React, { createContext, useState, useEffect } from "react";

// Crear el contexto para el modo oscuro
export const DarkModeContext = createContext();

/**
 * Proveedor del contexto del modo oscuro.
 *
 * @param {Object} props - Propiedades del componente.
 * @returns {JSX.Element} El proveedor del contexto.
 */
export const DarkModeProvider = ({ children }) => {
  const initialDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
