import React, { useState, useEffect } from "react";
import "./Tasks.css";

const Tasks = ({ userData }) => {
  const [tasks, setTasks] = useState([]); //; Estado de las tareas
  const [users, setUsers] = useState([]); //; Estado de los usuarios obtenidos del backend
  const [newTaskDescription, setNewTaskDescription] = useState(""); //; Descripción de la nueva tarea
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(""); //; Usuario asignado a la nueva tarea

  useEffect(() => {
    console.log("Componente montado. Cargando tareas y usuarios.");
    loadTasks();
    loadUsers(); //; Cargar usuarios al montar el componente
  }, []); //; Solo se llama una vez cuando el componente se monta

  const loadTasks = async () => {
    try {
      // Cambia la URL a la ruta correcta
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching tasks: " + response.statusText);
      }

      const tasksResult = await response.json();
      console.log("Tareas cargadas desde el servidor:", tasksResult.data); //; Debug: Ver las tareas cargadas
      setTasks(tasksResult.data); //; Actualiza el estado de las tareas
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
    }
  };

  //; Nueva función para cargar los usuarios
  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching users: " + response.statusText);
      }

      const usersResult = await response.json();
      console.log("Usuarios cargados desde el servidor:", usersResult.data); //; Debug: Ver los usuarios cargados
      setUsers(usersResult.data); //; Actualiza el estado de los usuarios
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    console.log("Intentando crear una nueva tarea.");
    if (userData.role === "admin" && newTaskDescription && newTaskAssignedTo) {
      const newTask = {
        description: newTaskDescription,
        status: "pending",
        user_id: newTaskAssignedTo, // Cambié `id` a `user_id` para reflejar la propiedad correcta
        created_at: new Date().toISOString(), //; Fecha de creación
      };
      try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(newTask),
        });
        const result = await response.json();
        if (response.status === 201) {
          setNewTaskDescription("");
          setNewTaskAssignedTo("");
          setTasks((prevTasks) => [...prevTasks, result.data]);
          console.log("Nueva tarea agregada al estado:", result.data); //; Debug: Ver la nueva tarea creada
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
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate && taskToUpdate.id === userData.id) {
      const updatedTask = { status: "done" }; //; Solo actualizamos el campo 'status'
      try {
        const response = await fetch(
          `http://localhost:3000/api/tasks/${taskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(updatedTask),
          }
        );
        const result = await response.json();
        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? result.data : task))
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
    if (userData.role === "admin") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/tasks/${taskId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );
        const result = await response.json();
        console.log("Resultado de eliminación:", result); //; Debug: Ver el resultado de la eliminación
        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
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
    const user = users.find((user) => user.id === userId); //; Usamos el estado `users` cargado desde el backend
    return user ? user.username : "Usuario desconocido";
  };

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {userData.role === "admin" && (
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
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
          <button type="submit">Crear Tarea</button>
        </form>
      )}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <p>{task.description}</p>
            <small>Asignado a: {getUsernameById(task.user_id)}</small>{" "}
            <small>Estado: {task.status}</small>
            {task.status === "pending" && task.user_id === userData.id && (
              <button onClick={() => handleCompleteTask(task.id)}>
                Marcar como completada
              </button>
            )}
            {userData.role === "admin" && (
              <button onClick={() => handleDeleteTask(task.id)}>
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
