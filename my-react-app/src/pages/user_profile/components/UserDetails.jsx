import React from "react";
import "./UserDetails.css"; // Importa los estilos CSS

/**
 * Componente para mostrar los detalles del usuario autenticado.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.userData - Datos del usuario autenticado.
 * @returns {JSX.Element} UserDetails
 */
const UserDetails = ({ userData }) => {
  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <h2>Información del Usuario</h2>
        <div className={`user-role ${userData.role_name.toLowerCase()}`}>
          {userData.role_name}
        </div>
      </div>
      <div className="user-info">
        <div className="user-info-item">
          <strong>Nombre de Usuario:</strong> {userData.username}
        </div>
        <div className="user-info-item">
          <strong>Nombre Completo:</strong> {userData.personalData.first_name}{" "}
          {userData.personalData.middle_name} {userData.personalData.last_name}
        </div>
        <div className="user-info-item">
          <strong>DNI:</strong> {userData.additionalData.dni}
        </div>
        <div className="user-info-item">
          <strong>Dirección:</strong> {userData.additionalData.address},{" "}
          {userData.additionalData.postal_code}
        </div>
      </div>
      <div className="user-contact">
        <h3>Contacto</h3>
        <ul>
          <li>
            <span>Email:</span> {userData.contactData.email}
          </li>
          <li>
            <span>Teléfono:</span> {userData.contactData.phone_number}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDetails;
