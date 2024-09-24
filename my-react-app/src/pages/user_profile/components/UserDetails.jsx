import React from "react";
import "./UserDetails.css"; // Importa los estilos CSS

/**
 * Componente para mostrar los detalles del usuario autenticado.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.userData - Datos del usuario autenticado.
 * @returns {JSX.Element} UserDetails
 */
const UserDetails = ({ userData }) => {
  // Combina los nombres del usuario si están disponibles
  const fullName = [userData?.name, userData?.firstname, userData?.lastname]
    .filter(Boolean) // Filtra los valores que no sean nulos o indefinidos
    .join(" "); // Une los nombres con un espacio

  return (
    <div className="user-details-container">
      <div className="user-details-header">
        {/* <h2>Información del Usuario</h2> */}
        <h2>id: '{userData.id}'</h2>
        {userData.role && (
          <div className={`user-role ${userData.role.toLowerCase()}`}>
            {userData.role}
          </div>
        )}
      </div>
      <div className="user-info">
        {userData.username && (
          <div className="user-info-item">
            <strong>Nombre de Usuario:</strong> {userData.username}
          </div>
        )}
        {/* Mostrar el nombre completo solo si alguno de los nombres existe */}
        {fullName && (
          <div className="user-info-item">
            <strong>Nombre Completo:</strong> {fullName}
          </div>
        )}
        {userData.dni && (
          <div className="user-info-item">
            <strong>DNI:</strong> {userData.dni}
          </div>
        )}
        {userData.address && userData.postal_code && (
          <div className="user-info-item">
            <strong>Dirección:</strong> {userData.address}, {userData.postal_code}
          </div>
        )}
      </div>
      {(userData.email || userData.telephone) && (
        <div className="user-contact">
          <h3>Contacto</h3>
          <ul>
            {userData.email && (
              <li>
                <span>Email:</span> {userData.email}
              </li>
            )}
            {userData.telephone && (
              <li>
                <span>Teléfono:</span> {userData.telephone}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
