import React, { useState, useEffect } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask, getAllUsers } from '../../../data_base/mockDatabase.mjs';
import './Tasks.css';

const Tasks = ({ userData }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = async () => {
    const tasksResult = await getAllTasks();
    if (tasksResult.status === 200) {
      setTasks(tasksResult.data);
    } else {
      console.error('Error al cargar las tareas:', tasksResult.message);
    }
  };

  const loadUsers = async () => {
    const usersResult = await getAllUsers();
    if (usersResult.status === 200) {
      setUsers(usersResult.data);
    } else {
      console.error('Error al cargar los usuarios:', usersResult.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (userData.role_name === 'admin' && newTaskDescription && newTaskAssignedTo) {
      const newTask = {
        description: newTaskDescription,
        status: 'pending',
        user_id: newTaskAssignedTo,
        entry_date: new Date().toISOString().split('T')[0]
      };
      const result = await createTask(newTask);
      if (result.status === 201) {
        setNewTaskDescription('');
        setNewTaskAssignedTo('');
        setTasks([...tasks, result.data]);
      } else {
        console.error('Error al crear la tarea:', result.message);
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    const taskToUpdate = tasks.find(task => task.task_id === taskId);
    if (taskToUpdate && taskToUpdate.user_id === userData.user_id) {
      const updatedTask = { ...taskToUpdate, status: 'done' };
      const result = await updateTask(taskId, updatedTask);
      if (result.status === 200) {
        setTasks(tasks.map(task => task.task_id === taskId ? result.data : task));
      } else {
        console.error('Error al completar la tarea:', result.message);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (userData.role_name === 'admin') {
      const result = await deleteTask(taskId);
      if (result.status === 200) {
        setTasks(tasks.filter(task => task.task_id !== taskId));
      } else {
        console.error('Error al eliminar la tarea:', result.message);
      }
    }
  };

  const getUsernameById = (userId) => {
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : 'Usuario desconocido';
  };

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {userData.role_name === 'admin' && (
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
            {users.map(user => (
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
    <div key={`${task.task_id}-${index}`} className={`task-item ${task.status}`}>
      <p>{task.description}</p>
      <small>Asignado a: {task.user_id}</small>
      <small>Estado: {task.status}</small>
      {task.status === 'pending' && task.user_id === userData.user_id && (
        <button onClick={() => handleCompleteTask(task.task_id)}>Marcar como completada</button>
      )}
      {userData.role_name === 'admin' && (
        <button onClick={() => handleDeleteTask(task.task_id)}>Eliminar</button>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default Tasks;