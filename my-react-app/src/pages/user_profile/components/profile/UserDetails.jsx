import React, { useEffect, useState } from "react";
import "./UserDetails.css";

/**
 * Componente para mostrar los detalles del usuario autenticado.
 * Muestra el recuento de tareas completadas.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.userData - Datos del usuario autenticado.
 * @returns {JSX.Element} UserDetails
 */
const UserDetails = ({ userData }) => {
  const [completedTasks, setCompletedTasks] = useState(0);

  // Efecto para cargar las tareas completadas cuando el componente se monta
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/tasks/completed/${userData.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Asegúrate de que el token esté presente
            },
          }
        );

        // Comprobamos si la respuesta es satisfactoria
        if (!response.ok) {
          throw new Error("No se pudieron obtener las tareas completadas");
        }

        const data = await response.json();
        setCompletedTasks(data.length); // Actualizamos el estado con el número de tareas completadas
      } catch (error) {
        console.error("Error al cargar las tareas completadas", error);
      }
    };

    fetchCompletedTasks();
  }, [userData.id]);

  // Combina los nombres del usuario si están disponibles
  const fullName = [userData?.name, userData?.firstname, userData?.lastname]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="SharedCard__card-background">
      <div className="SharedCard__item-user-div">
        <h2 className="SharedCard__title">
          {fullName.split(" ")[0]} - {userData.dni}
        </h2>
        {userData.role && (
          <div
            className={`user-role-tag ${userData.role.toLowerCase()} user-role-tag-UserDetais`}
          >
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
            <strong>Dirección:</strong> {userData.address},{" "}
            {userData.postal_code}
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

      {/* Sección para mostrar las tareas completadas */}
      <div className="user-tasks">
        <h3>Resumen de Tareas 24h</h3>
        <p>Tareas completadas: {completedTasks}</p>
      </div>
    </div>
  );
};

export default UserDetails;
