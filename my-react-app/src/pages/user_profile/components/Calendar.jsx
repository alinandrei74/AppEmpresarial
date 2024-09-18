import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ userData }) => {
    const [schedules, setSchedules] = useState([{ start: '', end: '', description: '', dayOfWeek: '' }]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('scheduleHistory')) || [];
        setHistory(savedHistory);
    }, []);

    const updateSchedule = (index, field, value) => {
        const updatedSchedules = schedules.map((schedule, i) =>
            i === index ? { ...schedule, [field]: value } : schedule
        );
        setSchedules(updatedSchedules);
    };

    const formatDateTime = (time) => {
        const today = new Date();
        const [hours, minutes] = time.split(':');
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${hours}:${minutes}:00`;
    };

    const handleSave = async () => {
      const hasEmptyFields = schedules.some(schedule =>
          !schedule.start || !schedule.end || !schedule.dayOfWeek || !schedule.description
      );
      if (hasEmptyFields) {
          alert('Por favor, completa todos los campos requeridos.');
          return;
      }

      const invalidSchedules = schedules.filter(schedule => {
          const startDate = new Date(formatDateTime(schedule.start));
          const endDate = new Date(formatDateTime(schedule.end));
          return endDate <= startDate;
      });

      if (invalidSchedules.length > 0) {
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

          const formattedSchedules = schedules.map(schedule => ({
              worker_id: userId,
              start_time: formatDateTime(schedule.start),
              end_time: formatDateTime(schedule.end),
              day_of_week: schedule.dayOfWeek,
              description: schedule.description,
          }));

          const response = await fetch('http://localhost:3000/api/work-schedules', { // Ensure the endpoint is correct
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formattedSchedules),
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error: ${response.status} - ${errorText}`);
          }

          const responseData = await response.json();
          console.log('Response:', responseData);

          // Optionally update the history or show a success message here

      } catch (error) {
          console.error('Error:', error);
          alert(`Error al guardar los horarios: ${error.message}`);
      }
  };

    return (
        <div className="schedule-container">
            <h2>Gestión de Horarios</h2>
            {schedules.map((schedule, index) => (
                <div className="schedule-input" key={index}>
                    <div className="time-row">
                        <div className="input-group time-group">
                            <label htmlFor={`start-time-${index}`}>Hora de inicio</label>
                            <input
                                id={`start-time-${index}`}
                                type="time"
                                className="small-input"
                                value={schedule.start}
                                onChange={(e) => updateSchedule(index, 'start', e.target.value)}
                            />
                        </div>

                        <div className="input-group time-group">
                            <label htmlFor={`end-time-${index}`}>Hora de fin</label>
                            <input
                                id={`end-time-${index}`}
                                type="time"
                                className="small-input"
                                value={schedule.end}
                                onChange={(e) => updateSchedule(index, 'end', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group description">
                        <label htmlFor={`description-${index}`}>Descripción</label>
                        <input
                            id={`description-${index}`}
                            type="text"
                            placeholder="Descripción del horario"
                            className="small-input"
                            value={schedule.description}
                            onChange={(e) => updateSchedule(index, 'description', e.target.value)}
                        />
                    </div>

                    <div className="input-group day-of-week">
                        <label htmlFor={`day-of-week-${index}`}>Día de la semana</label>
                        <select
                            id={`day-of-week-${index}`}
                            className="small-input"
                            value={schedule.dayOfWeek}
                            onChange={(e) => updateSchedule(index, 'dayOfWeek', e.target.value)}
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
            ))}
            <div className="button-container">
                <button className="send-button" onClick={handleSave}>Enviar Horarios</button>
            </div>

            <div>
                <h3 id='historial-de-horarios'>Historial de Horarios</h3>
                {history.length === 0 ? (
                    <p>No hay historial de horarios.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Horarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, index) => (
                                <tr key={index}>
                                    <td>{new Date(entry.date).toLocaleString()}</td>
                                    <td>
                                        {entry.schedules.map((sched, i) => (
                                            <div key={i}>
                                                {`${sched.start_time} - ${sched.end_time} (${sched.day_of_week}): ${sched.description}`}
                                            </div>
                                        ))}
                                    </td>
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
