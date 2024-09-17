import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../../data_base/mockDatabase.mjs";

const AddTaskForm = ({ onAddTask }) => {
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersResult = await getAllUsers();
    if (usersResult.status === 200) {
      setUsers(usersResult.data);
    } else {
      console.error("Error al cargar los usuarios:", usersResult.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.trim() && assignedTo) {
      onAddTask({
        description,
        user_id: assignedTo,
        status: "pending",
        entry_date: new Date().toISOString().split("T")[0],
      });
      setDescription("");
      setAssignedTo("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
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
