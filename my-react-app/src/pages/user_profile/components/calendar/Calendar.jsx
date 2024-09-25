import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Calendar.css";

const Calendar = ({ userData }) => {
  const [workSchedules, setSchedules] = useState([]);
  const [scheduleInput, setScheduleInput] = useState({
    start: "",
    end: "",
    description: "",
    dayOfWeek: "",
  });

  const loadSchedules = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/work-schedules", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const formattedSchedules = data.data.map((schedule) => ({
        id: schedule.id,
        start: schedule.start_time.split("T")[1].substring(0, 5),
        end: schedule.end_time.split("T")[1].substring(0, 5),
        description: schedule.description,
        dayOfWeek: schedule.day_of_week,
      }));

      setSchedules(formattedSchedules);
    } catch (error) {
      console.error("Error al cargar los horarios:", error);
      toast.error(`Error al cargar los horarios: ${error.message}`);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const updateScheduleInput = (field, value) => {
    setScheduleInput((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const formatDateTime = (time) => {
    const today = new Date();
    const [hours, minutes] = time.split(":");
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")} ${hours}:${minutes}:00`;
  };

  const handleSave = async () => {
    const { start, end, description, dayOfWeek } = scheduleInput;

    // Validación de campos requeridos
    if (!start || !end || !description || !dayOfWeek) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    const startDate = new Date(formatDateTime(start));
    const endDate = new Date(formatDateTime(end));

    // Validación de rango de tiempo
    if (endDate <= startDate) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      const formattedSchedule = {
        user_id: userData.id,
        start_time: formatDateTime(start),
        end_time: formatDateTime(end),
        day_of_week: dayOfWeek,
        description,
      };

      const response = await fetch("http://localhost:3000/api/work-schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedSchedule),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      setScheduleInput({ start: "", end: "", description: "", dayOfWeek: "" });
      loadSchedules();
      toast.success("Horarios guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los horarios:", error);
      toast.error(`Error al guardar los horarios: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/work-schedules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      loadSchedules(); // Recargar los horarios después de eliminar
      toast.success("Horario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
      toast.error(`Error al eliminar el horario: ${error.message}`);
    }
  };

  return (
    <div className="SharedCard__card-background schedule-container">
      <h2 className="SharedCard__title">Gestión de Horarios</h2>

      <div className="schedule-input">
        <div className="time-row">
          <div className="input-group time-group">
            <label htmlFor="start-time">Hora de inicio</label>
            <input
              id="start-time"
              type="time"
              required
              value={scheduleInput.start}
              onChange={(e) => updateScheduleInput("start", e.target.value)}
            />
          </div>

          <div className="input-group time-group">
            <label htmlFor="end-time">Hora de fin</label>
            <input
              id="end-time"
              type="time"
              required
              value={scheduleInput.end}
              onChange={(e) => updateScheduleInput("end", e.target.value)}
            />
          </div>
        </div>

        <div className="input-group description">
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            type="text"
            required
            placeholder="Descripción del horario"
            value={scheduleInput.description}
            onChange={(e) => updateScheduleInput("description", e.target.value)}
          />
        </div>

        <div className="input-group day-of-week">
          <label htmlFor="day-of-week">Día de la semana</label>
          <select
            id="day-of-week"
            required
            value={scheduleInput.dayOfWeek}
            onChange={(e) => updateScheduleInput("dayOfWeek", e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="Monday">Lunes</option>
            <option value="Tuesday">Martes</option>
            <option value="Wednesday">Miércoles</option>
            <option value="Thursday">Jueves</option>
            <option value="Friday">Viernes</option>
            <option value="Saturday">Sábado</option>
            <option value="Sunday">Domingo</option>
          </select>
        </div>
      </div>

      <div className="SharedCard__button-div">
        <button className="send-button" onClick={handleSave}>
          Enviar Horarios
        </button>
      </div>

      <div className="schedule-list">
        <h3>Historial de Horarios</h3>
        {workSchedules.length === 0 ? (
          <p>No hay historial de horarios.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Usuario</th>{" "}
                {/* Nueva columna para el nombre del usuario */}
                <th>Hora de inicio</th>
                <th>Hora de fin</th>
                <th>Descripción</th>
                <th>Día de la semana</th>
                {userData.role === "admin" && <th>Acciones</th>} {/* Nueva columna para las acciones */}
              </tr>
            </thead>
            <tbody>
              {workSchedules.map((sched, index) => (
                <tr key={index}>
                  <td>{userData.name}</td> {/* Mostrar el nombre del usuario */}
                  <td>{sched.start}</td>
                  <td>{sched.end}</td>
                  <td>{sched.description}</td>
                  <td>{sched.dayOfWeek}</td>
                  {userData.role === "admin" && (
                    <td>
                      <button
                        className="SharedCard__delete-button remove-button"
                        onClick={() => handleDelete(sched.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Calendar;
