import React, { createContext, useState, useEffect, useCallback } from "react";

// Crear el contexto para el modo oscuro
export const DarkModeContext = createContext();

/**
 ** Guarda el modo oscuro en localStorage y actualiza la clase del body.
 *
 * @param {boolean} darkMode - El estado del modo oscuro.
 */
const updateDarkMode = (darkMode) => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};

/**
 ** Proveedor del contexto del modo oscuro.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {JSX.Element} props.children - Componentes hijos que serán envueltos por el proveedor.
 * @returns {JSX.Element} El proveedor del contexto.
 */
const DarkModeProvider = ({ children }) => {
  const initialDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    updateDarkMode(darkMode);
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => !prevMode);
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
