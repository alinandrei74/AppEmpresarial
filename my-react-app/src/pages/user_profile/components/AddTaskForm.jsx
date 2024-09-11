import React, { useState } from "react";
import { getUsers } from "../../../data_base/mockDatabase";

const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const users = getUsers();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim() && assignedTo) {
      const assignedUser = users.find(user => user.user_id === assignedTo);
      onAddTask({
        title,
        description,
        assignedTo,
        assignedToName: assignedUser ? assignedUser.username : "Unknown"
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
      <textarea
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
        {users.map(user => (
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