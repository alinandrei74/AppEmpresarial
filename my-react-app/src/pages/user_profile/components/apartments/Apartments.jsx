import React from "react";
import "./Apartments.css"; // Importamos el CSS

// Importamos manualmente las imágenes
import img100 from "./public/img/100.jpg";
import img101 from "./public/img/101.jpg";
import img102 from "./public/img/102.jpg";
import img200 from "./public/img/200.jpg";
import img201 from "./public/img/201.jpg";
import img203 from "./public/img/203.jpg";
import img300 from "./public/img/300.jpg";

// Mapeo de imágenes por número de apartamento
const imageMap = {
  100: img100,
  101: img101,
  102: img102,
  200: img200,
  201: img201,
  203: img203,
  300: img300,
};

// Datos de apartamentos con información relevante para trabajadores
const apartmentsData = [
  {
    number: 100,
    floor: 1,
    rooms: 3,
    size: "120m²",
    status: "Necesita limpieza",
    airConditioning: true,
    maintenanceIssues: "Fuga de agua",
    cleaningStatus: "Limpieza pendiente",
    deliveryAccess: "Fácil acceso",
  },
  {
    number: 101,
    floor: 1,
    rooms: 2,
    size: "95m²",
    status: "En mantenimiento",
    airConditioning: false,
    maintenanceIssues: "Reparación eléctrica",
    cleaningStatus: "Limpieza completa",
    deliveryAccess: "Acceso moderado",
  },
  {
    number: 102,
    floor: 1,
    rooms: 4,
    size: "130m²",
    status: "Disponible",
    airConditioning: true,
    maintenanceIssues: "Ninguno",
    cleaningStatus: "Limpieza completa",
    deliveryAccess: "Acceso complicado",
  },
  {
    number: 200,
    floor: 2,
    rooms: 2,
    size: "70m²",
    status: "Limpieza en progreso",
    airConditioning: false,
    maintenanceIssues: "Revisión del techo",
    cleaningStatus: "Limpieza en progreso",
    deliveryAccess: "Acceso fácil",
  },
  {
    number: 201,
    floor: 2,
    rooms: 4,
    size: "130m²",
    status: "Revisión de mantenimiento",
    airConditioning: true,
    maintenanceIssues: "Sistema de aire acondicionado",
    cleaningStatus: "Limpieza pendiente",
    deliveryAccess: "Acceso restringido",
  },
  {
    number: 203,
    floor: 2,
    rooms: 3,
    size: "115m²",
    status: "Disponible",
    airConditioning: true,
    maintenanceIssues: "Ninguno",
    cleaningStatus: "Limpieza completa",
    deliveryAccess: "Acceso moderado",
  },
  {
    number: 300,
    floor: 3,
    rooms: 2,
    size: "80m²",
    status: "Limpieza en progreso",
    airConditioning: false,
    maintenanceIssues: "Ninguno",
    cleaningStatus: "Limpieza en progreso",
    deliveryAccess: "Acceso complicado",
  },
];

// Componente para renderizar diferentes propiedades según el rol
const renderApartmentDetails = (apt, role) => {
  return (
    <>
      {/* Opciones visibles para todos los roles */}
      <p>
        <strong>Piso:</strong> {apt.floor}
      </p>
      <p>
        <strong>Habitaciones:</strong> {apt.rooms}
      </p>
      <p>
        <strong>Tamaño:</strong> {apt.size}
      </p>

      {/* Opciones específicas por rol */}
      {role === "admin" && (
        <>
          <p>
            <strong>Estado:</strong> {apt.status}
          </p>
          <p>
            <strong>Aire Acondicionado:</strong>{" "}
            {apt.airConditioning ? "Sí" : "No"}
          </p>
          <p>
            <strong>Problemas de Mantenimiento:</strong> {apt.maintenanceIssues}
          </p>
          <p>
            <strong>Estado de Limpieza:</strong> {apt.cleaningStatus}
          </p>
          <p>
            <strong>Acceso para Reparto:</strong> {apt.deliveryAccess}
          </p>
        </>
      )}
      {role === "maintenance" && (
        <>
          <p>
            <strong>Aire Acondicionado:</strong>{" "}
            {apt.airConditioning ? "Sí" : "No"}
          </p>
          <p>
            <strong>Problemas de Mantenimiento:</strong> {apt.maintenanceIssues}
          </p>
        </>
      )}
      {role === "cleaning" && (
        <>
          <p>
            <strong>Estado de Limpieza:</strong> {apt.cleaningStatus}
          </p>
        </>
      )}
      {role === "delivery" && (
        <>
          <p>
            <strong>Acceso para Reparto:</strong> {apt.deliveryAccess}
          </p>
        </>
      )}
    </>
  );
};

const Apartments = ({ userData }) => {
  return (
    <div className="SharedCard__card-background apartments-container">
      <h2 className="SharedCard__title">Lista de Apartamentos</h2>
      <div className="apartments-grid">
        {apartmentsData.map((apt) => (
          <div key={apt.number} className="apartment-card">
            <img
              src={imageMap[apt.number]} // Mapeo de la imagen según el número del apartamento
              alt={`Apartamento ${apt.number}`}
              className="apartment-image"
            />
            <div className="apartment-info">
              <h2>Apartamento {apt.number}</h2>
              {/* Renderizar detalles basados en el rol */}
              {renderApartmentDetails(apt, userData.role)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apartments;
