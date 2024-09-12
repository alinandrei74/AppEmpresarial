import React, { useState, useEffect } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../../../data_base/mockDatabase.mjs';
import AddTaskForm from './AddTaskForm';
import './Tasks.css';

const Tasks = ({ userData }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const tasksResult = await getAllTasks();
    if (tasksResult.status === 200) {
      setTasks(tasksResult.data);
    } else {
      console.error('Error al cargar las tareas:', tasksResult.message);
    }
  };

  const handleAddTask = async (newTask) => {
    if (userData.role_name === 'admin') {
      const result = await createTask(newTask);
      if (result.status === 201) {
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

  return (
    <div className="tasks-container">
      <h2>Tareas</h2>
      {userData.role_name === 'admin' && (
        <AddTaskForm onAddTask={handleAddTask} />
      )}
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.task_id} className={`task-item ${task.status}`}>
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