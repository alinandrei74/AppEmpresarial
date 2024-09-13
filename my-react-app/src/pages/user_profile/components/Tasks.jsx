import React, { useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllUsers,
} from "../../../data_base/mockDatabase.mjs";
import "./Tasks.css";

const Tasks = ({ userData }) => {
  const [tasks, setTasks] = useState([]); //; Estado de las tareas
  const [users, setUsers] = useState([]); //; Estado de los usuarios
  const [newTaskDescription, setNewTaskDescription] = useState(""); //; Descripción de la nueva tarea
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(""); //; Usuario asignado a la nueva tarea

  useEffect(() => {
    console.log("Componente montado. Cargando tareas y usuarios.");
    loadTasks();
    loadUsers();
  }, []); //; Solo se llama una vez cuando el componente se monta

  const loadTasks = async () => {
    try {
      const tasksResult = await getAllTasks();
      if (tasksResult.status === 200) {
        console.log("Tareas cargadas desde el servidor:", tasksResult.data); //; Debug: Ver las tareas cargadas
        setTasks(tasksResult.data); //; Actualiza el estado de las tareas
      } else {
        console.error("Error al cargar las tareas:", tasksResult.message);
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
    }
  };

  const loadUsers = async () => {
    try {
      const usersResult = await getAllUsers();
      if (usersResult.status === 200) {
        console.log("Usuarios cargados desde el servidor:", usersResult.data); //; Debug: Ver los usuarios cargados
        setUsers(usersResult.data);
      } else {
        console.error("Error al cargar los usuarios:", usersResult.message);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    console.log("Intentando crear una nueva tarea.");
    if (
      userData.role_name === "admin" &&
      newTaskDescription &&
      newTaskAssignedTo
    ) {
      const newTask = {
        description: newTaskDescription,
        status: "pending",
        user_id: newTaskAssignedTo,
        entry_date: new Date().toISOString().split("T")[0], //; Fecha de entrada como YYYY-MM-DD
      };
      try {
        const result = await createTask(newTask);
        if (result.status === 201) {
          setNewTaskDescription("");
          setNewTaskAssignedTo("");
          //; Agrega la nueva tarea solo si no está ya presente en el estado
          setTasks((prevTasks) => {
            const exists = prevTasks.some(
              (task) => task.task_id === result.data.task_id
            );
            if (!exists) {
              console.log("Nueva tarea agregada al estado:", result.data); //; Debug: Ver la nueva tarea creada
              return [...prevTasks, result.data];
            } else {
              console.log("Tarea ya existe en el estado. Evitando duplicado."); //; Debug: Evitar duplicado
              return prevTasks;
            }
          });
        } else {
          console.error("Error al crear la tarea:", result.message);
        }
      } catch (error) {
        console.error("Error al crear la tarea:", error.message);
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    console.log("Completando tarea con ID:", taskId); //; Debug: Ver el ID de la tarea a completar
    const taskToUpdate = tasks.find((task) => task.task_id === taskId);
    if (taskToUpdate && taskToUpdate.user_id === userData.user_id) {
      const updatedTask = { status: "done" }; //; Solo actualizamos el campo 'status'
      try {
        const result = await updateTask(taskId, updatedTask);
        if (result.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.task_id === taskId ? result.data : task
            )
          );
          console.log("Tarea completada:", result.data); //; Debug: Ver la tarea actualizada
        } else {
          console.error("Error al completar la tarea:", result.message);
        }
      } catch (error) {
        console.error("Error al completar la tarea:", error.message);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log("Intentando eliminar tarea con ID:", taskId); //; Debug: Ver el ID de la tarea a eliminar
    if (userData.role_name === "admin") {
      try {
        const result = await deleteTask(taskId);
        console.log("Resultado de eliminación:", result); //; Debug: Ver el resultado de la eliminación
        if (result.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.task_id !== taskId)
          );
          console.log("Tarea eliminada exitosamente"); //; Debug: Confirmar eliminación
        } else {
          console.error("Error al eliminar la tarea:", result.message);
        }
      } catch (error) {
        console.error("Error al eliminar la tarea:", error.message);
      }
    }
  };

  const getUsernameById = (userId) => {
    const user = users.find((user) => user.user_id === userId);
    return user ? user.username : "Usuario desconocido";
  };

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {userData.role_name === "admin" && (
        <form onSubmit={handleCreateTask} className="create-task-form">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Descripción de la tarea"
            required
          />
          <select
            value={newTaskAssignedTo}
            onChange={(e) => setNewTaskAssignedTo(e.target.value)}
            required
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.username} ({user.role_name})
              </option>
            ))}
          </select>
          <button type="submit">Crear Tarea</button>
        </form>
      )}
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div
            key={`${task.task_id}-${index}`}
            className={`task-item ${task.status}`}
          >
            <p>{task.description}</p>
            <small>Asignado a: {getUsernameById(task.user_id)}</small>
            <small>Estado: {task.status}</small>
            {task.status === "pending" && task.user_id === userData.user_id && (
              <button onClick={() => handleCompleteTask(task.task_id)}>
                Marcar como completada
              </button>
            )}
            {userData.role_name === "admin" && (
              <button onClick={() => handleDeleteTask(task.task_id)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
