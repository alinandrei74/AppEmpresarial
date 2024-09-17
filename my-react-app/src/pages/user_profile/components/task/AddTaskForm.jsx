import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../../../data_base/mockDatabase.mjs";

/**
 * Formulario para añadir nuevas tareas.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onAddTask - Función para añadir una nueva tarea.
 * @param {Object} props.userData - Datos del usuario autenticado.
 * @returns {JSX.Element} AddTaskForm
 */
const AddTaskForm = ({ onAddTask, userData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Cargar los usuarios del servidor.
   */
  const loadUsers = async () => {
    const usersResult = await getAllUsers();
    if (usersResult.status === 200) {
      setUsers(usersResult.data.filter((user) => user.user_id !== userData.id)); // Excluir al usuario actual
    } else {
      console.error("Error al cargar los usuarios:", usersResult.message);
    }
  };

  /**
   * Manejar el submit del formulario.
   * @param {Event} e - Evento de submit del formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim() && assignedTo) {
      onAddTask({
        title,
        description,
        user_id: assignedTo,
        status: "pending",
        entry_date: new Date().toISOString().split("T")[0],
      });
      setTitle("");
      setDescription("");
      setAssignedTo("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la tarea"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la tarea"
        required
      />
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
      >
        <option value="">Seleccionar usuario</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.username} ({user.role_name})
          </option>
        ))}
      </select>
      <button type="submit">Añadir Tarea</button>
    </form>
  );
};

export default AddTaskForm;
