//TODO#code3: Implementar carga progresiva de tareas mientras el usuario se desplaza hacia abajo en la página.
//! (NO LO CONSIGO 😭) La barra de desplazamiento debe activar la carga de más tareas cuando llegue al final, asegurando un rendimiento óptimo.

//TODO#code3: Al crear una nueva tarea, enviar una notificación por correo electrónico al usuario asignado.
//; El correo será enviado usando las credenciales de la empresa (PASS_COMPANY y EMAIL_COMPANY) configuradas en el archivo .env.
//; El destinatario será el correo electrónico del usuario asignado a la tarea.

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
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrderTask") === "asc" ||
      localStorage.getItem("sortOrderTask") === "desc"
      ? localStorage.getItem("sortOrderTask")
      : "asc"
  );

  //; Cargar filtro desde el localStorage al montar
  useEffect(() => {
    const storedSortOrder = localStorage.getItem("sortOrderTask");
    if (storedSortOrder) {
      setSortOrder(storedSortOrder);
    }
    loadTasks(); //; Cargar las tareas al montar el componente

    if (userData.role === "admin") {
      loadUsers(); //; Cargar usuarios si es administrador
    }

    const interval = setInterval(() => {
      console.log("Actualizando tareas...");
      loadTasks();
    }, 60000); //; 60000 ms = 1 minuto

    return () => clearInterval(interval);
  }, []);

  //; Guardar el filtro en localStorage cuando se cambie
  useEffect(() => {
    localStorage.setItem("sortOrderTask", sortOrder); //; Guardar el orden en localStorage
    updateTaskView(tasks); //; Actualizar la vista de las tareas cuando se cambie el orden
  }, [sortOrder]);

  //; Función para alternar el orden de las tareas
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    updateTaskView(tasks, newSortOrder); //; Actualizar la vista al cambiar el orden
  };

  //; Función para ordenar y filtrar las tareas, y actualizar la vista
  const updateTaskView = (rawTasks, currentSortOrder = sortOrder) => {
    const sortedTasks = [...rawTasks].sort((a, b) =>
      currentSortOrder === "asc"
        ? new Date(a.updated_at) - new Date(b.updated_at)
        : new Date(b.updated_at) - new Date(a.updated_at)
    );

    //; Filtrar tareas: el administrador ve todas, los usuarios solo las asignadas a ellos
    const filteredTasks =
      userData.role === "admin"
        ? sortedTasks
        : sortedTasks.filter((task) => task.user_id === userData.id);

    setTasks(filteredTasks); //; Actualizar el estado de las tareas
    // filteredTasks.forEach((e) => {
    //   console.log(`${e.title}, ${e.updated_at}\n`);
    // });
    // console.log(`\n`);
  };

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
      const tasksData = tasksResult.data;

      updateTaskView(tasksData, sortOrder); //; Actualizar la vista con las tareas cargadas
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
    }
  };

  /**
   ** Crear una nueva tarea.
   * @param {Event} e - Evento de submit del formulario.
   */
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (newTaskTitle && newTaskDescription && newTaskAssignedTo) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        is_done: false,
        user_id: newTaskAssignedTo,
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
          // updateTaskView([...tasks, result.data]); //; Añadir la nueva tarea y actualizar la vista
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
   ** Marcar una tarea como completada.
   * @param {number} taskId - ID de la tarea a completar.
   */
  const handleCompleteTask = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate && taskToUpdate.user_id === userData.id) {
      const updatedTask = {
        ...taskToUpdate,
        is_done: true,
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
          const updatedTasks = tasks.map((task) =>
            task.id === taskId ? result.data : task
          );
          updateTaskView(updatedTasks); //; Actualizar la vista con la tarea completada
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
   ** Eliminar una tarea.
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
   ** Editar una tarea existente.
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
   ** Editar una tarea existente.
   * @param {Object} task - Tarea a editar.
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
          const updatedTasks = tasks.map((task) =>
            task.id === editingTask.id ? result.data : task
          );
          updateTaskView(updatedTasks); //; Actualizar la vista con la tarea editada
          setEditingTask(null);
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
   ** Cancelar la edición de una tarea.
   */
  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAssignedTo("");
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
    <div className="SharedCard__card-background tasks-container">
      <h2 className="SharedCard__title">Tareas</h2>

      <div className="SharedCard__card-first-layer">
        {userData.role === "admin" && (
          <form
            onSubmit={editingTask ? handleSaveEdit : handleCreateTask}
            className="SharedCard__form"
          >
            <input
              ref={newTaskTitleRef} //; Asignar la referencia al input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value.slice(0, 100))} //; Limitar el título a 30 caracteres
              placeholder="Título de la tarea (máximo 100 caracteres)"
              maxLength={100} //; Limitar el input del título
              required
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) =>
                setNewTaskDescription(e.target.value.slice(0, 200))
              } //; Limitar la descripción a 200 caracteres
              placeholder="Descripción de la tarea (máximo 200 caracteres)"
              maxLength={200} //; Limitar el input de la descripción
              required
              style={{ height: "75px", resize: "none" }} //; Mayor altura y deshabilitar el redimensionamiento
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

        <div className="SharedCard__filter-button-div">
          <button onClick={toggleSortOrder}>
            Orden {sortOrder === "asc" ? "Antiguo" : "Reciente"}
          </button>
        </div>
      </div>

      <div className="SharedCard__items-list">
        {tasks.map((task) => {
          const { fullName, username, role } = getUsernameById(task.user_id); //; Obtener el nombre y el rol del usuario

          return (
            <div
              key={task.id}
              className={`SharedCard__item ${
                task.is_done ? "done" : "pending"
              }`}
            >
              {userData.role === "admin" && (
                <div className="SharedCard__item-user-div">
                  <h1>
                    {task.user_id === userData.id
                      ? "(TÚ)"
                      : `${fullName.split(" ")[0]} ${fullName.split(" ")[1]}`}
                  </h1>

                  {userData.role && (
                    <div className={`user-role-tag ${role}`}>{role}</div>
                  )}
                </div>
              )}

              <h1>{task.title}</h1>
              <h2>{task.description}</h2>

              {/* <small>Estado: {task.is_done}</small> */}

              {task.is_done === false && task.user_id === userData.id && (
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
                    className="SharedCard__delete-button"
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
