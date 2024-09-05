import React, { useState, useEffect } from "react";
import { obtenerTareas, crearTarea, marcarTareaComoCompletada, eliminarTarea } from "../../../data_base/mockDatabase";
import "./Tasks.css";

const Tasks = ({ role, userId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ description: "", assignedTo: "" });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = () => {
    const tareasCargadas = obtenerTareas();
    setTasks(tareasCargadas);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (role === "admin" && newTask.description && newTask.assignedTo) {
      const tarea = crearTarea(newTask);
      setTasks([...tasks, tarea]);
      setNewTask({ description: "", assignedTo: "" });
    }
  };

  const handleCompleteTask = (taskId) => {
    const tareaActualizada = marcarTareaComoCompletada(taskId);
    if (tareaActualizada) {
      setTasks(tasks.map(task => task.id === taskId ? tareaActualizada : task));
    }
  };

  const handleDeleteTask = (taskId) => {
    if (role === "admin") {
      const eliminada = eliminarTarea(taskId);
      if (eliminada) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    }
  };

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {role === "admin" && (
        <form onSubmit={handleCreateTask} className="create-task-form">
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            placeholder="Descripción de la tarea"
            required
          />
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
            required
          >
            <option value="">Asignar a...</option>
            <option value="cleaning">Limpieza</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="delivery">Entrega</option>
          </select>
          <button type="submit">Crear Tarea</button>
        </form>
      )}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
            <p>{task.description}</p>
            <small>Asignado a: {task.assignedTo}</small>
            <small>Estado: {task.completed ? 'Completada' : 'Pendiente'}</small>
            {!task.completed && task.assignedTo === role && (
              <button onClick={() => handleCompleteTask(task.id)}>Marcar como completada</button>
            )}
            {role === "admin" && task.completed && (
              <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;