import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getAllTasks } from '../../data_base/mockDatabase.mjs';
import './UserManagement.css';

const UserManagement = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [hasPendingTasksFilter, setHasPendingTasksFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, roleFilter, hasPendingTasksFilter, sortOrder, searchTerm]);

  const loadUsers = async () => {
    const result = await getAllUsers();
    if (result.status === 200) {
      setUsers(result.data);
    } else {
      console.error('Error al cargar usuarios:', result.message);
    }
  };

  const loadTasks = async () => {
    const result = await getAllTasks();
    if (result.status === 200) {
      setTasks(result.data);
    } else {
      console.error('Error al cargar tareas:', result.message);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesRole = roleFilter === 'all' || user.role_name === roleFilter;
      const matchesPendingTasks = !hasPendingTasksFilter || 
        tasks.some(task => task.user_id === user.user_id && task.status === 'pending');
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.personalData?.first_name + ' ' + user.personalData?.last_name).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesPendingTasks && matchesSearch;
    });

    filtered.sort((a, b) => {
      return sortOrder === 'desc' 
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const result = await deleteUser(userId);
      if (result.status === 200) {
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
      } else {
        console.error('Error al eliminar usuario:', result.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      <div className="filters">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cleaning">Limpieza</option>
          <option value="delivery">Entrega</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={hasPendingTasksFilter}
            onChange={(e) => setHasPendingTasksFilter(e.target.checked)}
          />
          Con tareas pendientes
        </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Más nuevo primero</option>
          <option value="asc">Más antiguo primero</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Tareas Pendientes</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.user_id}>
              <td>{`${user.personalData?.first_name || ''} ${user.personalData?.last_name || ''} ${user.username}`}</td>
              <td>{user.role_name}</td>
              <td>{tasks.filter(task => task.user_id === user.user_id && task.status === 'pending').length}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <button 
                  onClick={() => handleDeleteUser(user.user_id)}
                  disabled={user.user_id === currentUserId}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;