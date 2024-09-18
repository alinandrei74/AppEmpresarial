import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, roleFilter, sortOrder, searchTerm]);

  const loadUsers = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data);
      } else {
        console.error('Error al cargar usuarios:', await response.text());
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name + ' ' + user.firstname + ' ' + user.lastname).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });

    filtered.sort((a, b) => {
      return sortOrder === 'desc' 
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } else {
          console.error('Error al eliminar usuario:', await response.text());
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
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
            <th>Email</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{`${user.name} ${user.firstname} ${user.lastname} (${user.username})`}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.created_at)}</td>
              <td>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={user.id === currentUserId}
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