import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ userData }) => {
  const [work_schedules, setSchedules] = useState([]); // Estado para almacenar el historial de horarios guardados
  const [scheduleInput, setScheduleInput] = useState({
    start: '',
    end: '',
    description: '',
    dayOfWeek: '',
  }); // Estado para los inputs del formulario
  const [history, setHistory] = useState([]);

  // Función para cargar los horarios del backend cuando el componente se monta
  const loadSchedules = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert('No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/work-schedules`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Data recibida:", data);

      const formattedSchedules = data.data.map(schedule => ({
        start: schedule.start_time.split('T')[1].substring(0, 5), // Extrae la hora
        end: schedule.end_time.split('T')[1].substring(0, 5),
        description: schedule.description,
        dayOfWeek: schedule.day_of_week,
      }));

      setSchedules(formattedSchedules);
    } catch (error) {
      console.error('Error al cargar los horarios:', error);
      alert(`Error al cargar los horarios: ${error.message}`);
    }
  };

  // Cargar historial desde LocalStorage y cargar horarios al montar el componente
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('scheduleHistory')) || [];
    setHistory(savedHistory);

    // Llamada al backend para cargar los horarios
    loadSchedules();
  }, []);

  // Función para actualizar los inputs del formulario de horarios
  const updateScheduleInput = (field, value) => {
    setScheduleInput(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Función para formatear fecha y hora para el backend
  const formatDateTime = (time) => {
    const today = new Date();
    const [hours, minutes] = time.split(':');
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${hours}:${minutes}:00`;
  };

  // Función para guardar los horarios
  const handleSave = async () => {
    const { start, end, description, dayOfWeek } = scheduleInput;

    if (!start || !end || !description || !dayOfWeek) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const startDate = new Date(formatDateTime(start));
    const endDate = new Date(formatDateTime(end));

    if (endDate <= startDate) {
      alert('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert('No se encontró el token de autenticación.');
        return;
      }

      const userId = userData.id;

      const formattedSchedule = {
        user_id: userId,
        start_time: formatDateTime(start),
        end_time: formatDateTime(end),
        day_of_week: dayOfWeek,
        description,
      };

      const response = await fetch('http://localhost:3000/api/work-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedSchedule),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response:', responseData);

      // Actualizar el historial con los nuevos horarios
      const newHistory = [...history, { date: new Date(), schedules: [formattedSchedule] }];
      setHistory(newHistory);
      localStorage.setItem('scheduleHistory', JSON.stringify(newHistory));

      // Resetear los campos del formulario después de guardar
      setScheduleInput({ start: '', end: '', description: '', dayOfWeek: '' });

      alert('Horarios guardados exitosamente.');
      loadSchedules(); // Recargar la lista de horarios

    } catch (error) {
      console.error('Error al guardar los horarios:', error);
      alert(`Error al guardar los horarios: ${error.message}`);
    }
  };

  return (
    <div className="schedule-container">
      <h2>Gestión de Horarios</h2>

      {/* Formulario para ingresar nuevos horarios */}
      <div className="schedule-input">
        <div className="time-row">
          <div className="input-group time-group">
            <label htmlFor="start-time">Hora de inicio</label>
            <input
              id="start-time"
              type="time"
              className="small-input"
              value={scheduleInput.start}
              onChange={(e) => updateScheduleInput('start', e.target.value)}
            />
          </div>

          <div className="input-group time-group">
            <label htmlFor="end-time">Hora de fin</label>
            <input
              id="end-time"
              type="time"
              className="small-input"
              value={scheduleInput.end}
              onChange={(e) => updateScheduleInput('end', e.target.value)}
            />
          </div>
        </div>

        <div className="input-group description">
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            type="text"
            placeholder="Descripción del horario"
            className="small-input"
            value={scheduleInput.description}
            onChange={(e) => updateScheduleInput('description', e.target.value)}
          />
        </div>

        <div className="input-group day-of-week">
          <label htmlFor="day-of-week">Día de la semana</label>
          <select
            id="day-of-week"
            className="small-input"
            value={scheduleInput.dayOfWeek}
            onChange={(e) => updateScheduleInput('dayOfWeek', e.target.value)}
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

      <div className="button-container">
        <button className="send-button" onClick={handleSave}>Enviar Horarios</button>
      </div>

      {/* Historial de horarios */}
      <div>
        <h3 id="historial-de-horarios">Historial de Horarios</h3>
        {work_schedules.length === 0 ? (
          <p>No hay historial de horarios.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Hora de inicio</th>
                <th>Hora de fin</th>
                <th>Descripción</th>
                <th>Día de la semana</th>
              </tr>
            </thead>
            <tbody>
              {work_schedules.map((sched, index) => (
                <tr key={index}>
                  <td>{sched.start}</td>
                  <td>{sched.end}</td>
                  <td>{sched.description}</td>
                  <td>{sched.dayOfWeek}</td>
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


