import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

/**
 * Componente que muestra un mensaje de error cuando la página no se encuentra.
 * @component
 * @returns {JSX.Element} NotFound
 */
const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="error-message">404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/">Volver a la página principal</Link>
    </div>
  );
};

export default NotFound;
