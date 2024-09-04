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
  const fullName = [
    userData.personalData?.first_name,
    userData.personalData?.middle_name,
    userData.personalData?.last_name,
  ]
    .filter(Boolean) // Filtra los valores que no sean nulos o indefinidos
    .join(" "); // Une los nombres con un espacio

  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <h2>Información del Usuario</h2>
        {userData.role_name && (
          <div className={`user-role ${userData.role_name.toLowerCase()}`}>
            {userData.role_name}
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
        {userData.additionalData && userData.additionalData.dni && (
          <div className="user-info-item">
            <strong>DNI:</strong> {userData.additionalData.dni}
          </div>
        )}
        {userData.additionalData &&
          userData.additionalData.address &&
          userData.additionalData.postal_code && (
            <div className="user-info-item">
              <strong>Dirección:</strong> {userData.additionalData.address},{" "}
              {userData.additionalData.postal_code}
            </div>
          )}
      </div>
      {userData.contactData &&
        (userData.contactData.email || userData.contactData.phone_number) && (
          <div className="user-contact">
            <h3>Contacto</h3>
            <ul>
              {userData.contactData.email && (
                <li>
                  <span>Email:</span> {userData.contactData.email}
                </li>
              )}
              {userData.contactData.phone_number && (
                <li>
                  <span>Teléfono:</span> {userData.contactData.phone_number}
                </li>
              )}
            </ul>
          </div>
        )}
    </div>
  );
};

export default UserDetails;
