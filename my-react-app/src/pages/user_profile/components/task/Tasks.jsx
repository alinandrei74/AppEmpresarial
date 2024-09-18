//TODO#code3: que las tareas se cargen progresivamente segun la pagina la barra de la pagina va deslizandose acia abajo.
//TODO#code3: Cuando se cree una tarea que se envie un email usando el emmail de la empresa de ejemplo y la contraseña de el que envia el emmail y el que lo recibe sera el usuario al que va dirigida la tarea usa las variables de PASS_COMPANY y EMAIL_COMPANY del archivo env
//TODO#code3: Mejorar el tamaño y del titulo y descripcion de las targetas de las tareas, limitar el texto del titulo y de la descripcion por ejemplo titulo a 30 caracteres y descripcion a 200. Tambien que no se muestre el nombre del usuario si no eres administrador en tus tareas y se te mueste mejor la descripcion y el titulo con mas espacio ya que el nombre no estaria

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./Tasks.css";

/**
 * Componente para gestionar y mostrar las tareas del usuario.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.userData - Datos del usuario autenticado.
 * @returns {JSX.Element} Tasks
 */
const Tasks = ({ userData }) => {
  const [tasks, setTasks] = useState([]); //; Estado de las tareas
  const [users, setUsers] = useState([]); //; Estado de los usuarios obtenidos del backend
  const [newTaskTitle, setNewTaskTitle] = useState(""); //; Título de la nueva tarea
  const newTaskTitleRef = useRef(null); //; Crear una referencia para el input de título

  const [newTaskDescription, setNewTaskDescription] = useState(""); //; Descripción de la nueva tarea
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(""); //; Usuario asignado a la nueva tarea
  const [editingTask, setEditingTask] = useState(null); //; Tarea que se está editando
  useEffect(() => {
    loadTasks();
    if (userData.role === "admin") {
      loadUsers(); //; Cargar usuarios para todos los roles, no solo para administradores
    }

    const interval = setInterval(() => {
      console.log("Actualizando tareas...");
      loadTasks();
    }, 60000); //; 60000 ms = 1 minuto

    return () => clearInterval(interval);
  }, []);

  /**
   * Cargar las tareas del servidor.
   */
  const loadTasks = async () => {
    try {
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

      //; Filtrar tareas: el administrador ve todas, los usuarios solo las asignadas a ellos
      const filteredTasks =
        userData.role === "admin"
          ? tasksResult.data
          : tasksResult.data.filter((task) => task.user_id === userData.id);

      setTasks(filteredTasks); //; Actualizar el estado de las tareas
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
    }
  };

  /**
   * Cargar los usuarios del servidor.
   */
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
      setUsers(usersResult.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
    }
  };

  /**
   * Crear una nueva tarea.
   * @param {Event} e - Evento de submit del formulario.
   */
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (newTaskTitle && newTaskDescription && newTaskAssignedTo) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: "pending",
        user_id: newTaskAssignedTo,
        created_at: new Date().toISOString(),
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
          setTasks((prevTasks) => [...prevTasks, result.data]);
          setNewTaskTitle("");
          setNewTaskDescription("");
          setNewTaskAssignedTo("");
          loadTasks(); //; Recargar tareas para asegurar que los nombres de usuario y el estado sean correctos
          toast.success("¡Tarea creada con éxito!");
        } else {
          throw new Error(result.message || "Error al crear la tarea.");
        }
      } catch (error) {
        console.error("Error al crear la tarea:", error.message);
        toast.error("Error al crear la tarea.");
      }
    }
  };

  /**
   * Marcar una tarea como completada.
   * @param {number} taskId - ID de la tarea a completar.
   */
  const handleCompleteTask = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate && taskToUpdate.user_id === userData.id) {
      const updatedTask = {
        ...taskToUpdate,
        status: "done",
      };

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
        if (response.ok && result.data) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? result.data : task))
          );
          toast.success("¡Tarea completada con éxito!");
        } else {
          throw new Error(result.message || "Error al completar la tarea.");
        }
      } catch (error) {
        console.error("Error al completar la tarea:", error.message);
        toast.error("Error al completar la tarea.");
      }
    }
  };

  /**
   * Eliminar una tarea.
   * @param {number} taskId - ID de la tarea a eliminar.
   */
  const handleDeleteTask = async (taskId) => {
    //; Agregar una condición para ejecutar handleCancelEdit solo cuando esté en modo edición
    if (editingTask) {
      handleCancelEdit();
    }

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

        if (!response.ok) {
          throw new Error("Error al eliminar la tarea.");
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        toast.success("¡Tarea eliminada con éxito!");
      } catch (error) {
        console.error("Error al eliminar la tarea:", error.message);
        toast.error("Error al eliminar la tarea.");
      }
    }
  };

  /**
   * Editar una tarea existente.
   * @param {Object} task - Tarea a editar.
   */
  const handleEditTask = (task) => {
    setEditingTask(task); //; Establecer la tarea que se va a editar
    setNewTaskTitle(task.title); //; Cargar título de la tarea
    setNewTaskDescription(task.description); //; Cargar descripción de la tarea
    setNewTaskAssignedTo(task.user_id); //; Cargar usuario asignado

    //; Desplazar la pantalla hacia arriba de manera suave
    window.scrollTo({ top: 0, behavior: "smooth" });

    //; Usar un pequeño retraso para enfocar en el input de título después del scroll
    setTimeout(() => {
      if (newTaskTitleRef.current) {
        newTaskTitleRef.current.focus(); //; Enfocar en el input de título
      }
    }, 300); //; 300 ms para permitir que el scroll suave termine
  };

  /**
   * Guardar los cambios en la tarea editada.
   */
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (editingTask && newTaskTitle && newTaskDescription) {
      const updatedTask = {
        ...editingTask,
        title: newTaskTitle,
        description: newTaskDescription,
        user_id: newTaskAssignedTo,
      };

      try {
        const response = await fetch(
          `http://localhost:3000/api/tasks/${editingTask.id}`,
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
        if (response.ok && result.data) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === editingTask.id ? result.data : task
            )
          );
          setEditingTask(null); //; Limpiar el modo de edición
          setNewTaskTitle("");
          setNewTaskDescription("");
          setNewTaskAssignedTo("");
          toast.success("¡Tarea actualizada con éxito!");
        } else {
          throw new Error(result.message || "Error al actualizar la tarea.");
        }
      } catch (error) {
        console.error("Error al actualizar la tarea:", error.message);
        toast.error("Error al actualizar la tarea.");
      }
    }
  };

  /**
   * Cancelar la edición de una tarea.
   */
  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAssignedTo("");
  };

  /**
   * Obtener el nombre completo, nombre de usuario y rol por ID.
   * @param {number} userId - ID del usuario.
   * @returns {Object} Objeto que contiene el nombre completo, nombre de usuario y rol.
   */
  const getUsernameById = (userId) => {
    const user =
      userId === userData.id
        ? userData //; Si el userId es el del usuario actual, usamos directamente userData
        : users.find((user) => user.id === userId); //; Buscar en la lista de usuarios

    //; Retornar valores del usuario encontrado o valores por defecto
    return {
      fullName:
        [user?.name, user?.firstname, user?.lastname]
          .filter(Boolean)
          .join(" ") || "Usuario desconocido",
      username: user?.username || "Usuario desconocido",
      role: user?.role || "unknown",
    };
  };

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {userData.role === "admin" && (
        <form
          onSubmit={editingTask ? handleSaveEdit : handleCreateTask}
          className="create-task-form"
        >
          <input
            ref={newTaskTitleRef} //; Asignar la referencia al input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Título de la tarea"
            required
          />
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
            {users
              .filter((user) => user.id !== userData.id) //; Excluir al usuario actual
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.role})
                </option>
              ))}
          </select>
          <button type="submit">
            {editingTask ? "Guardar Cambios" : "Crear Tarea"}
          </button>
          {editingTask && (
            <button type="button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </form>
      )}
      <div className="tasks-list">
        {tasks.map((task) => {
          const { fullName, username, role } = getUsernameById(task.user_id); //; Obtener el nombre y el rol del usuario

          return (
            <div key={task.id} className={`task-item ${task.status}`}>
              {/* Añadir la clase correspondiente al rol del usuario */}

              <div className="user-details-task">
                {/* <h2>Información del Usuario</h2> */}
                <h2>
                  {fullName.split(" ")[0]} {fullName.split(" ")[1]}
                </h2>
                {userData.role && (
                  <div className={`user-role ${role}`}>{role}</div>
                )}
              </div>

              <p>
                <strong>{task.title}</strong>
              </p>
              <p>{task.description}</p>

              {/* <small>Estado: {task.status}</small> */}

              {task.status === "pending" && task.user_id === userData.id && (
                <button
                  className="complete-task-button"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  Marcar como completada
                </button>
              )}

              {userData.role === "admin" && (
                <>
                  <button onClick={() => handleEditTask(task)}>Editar</button>
                  <button
                    className="delete-task-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;
