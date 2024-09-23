import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Importar react-toastify
import "./UserManagement.css";

const UserManagement = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, roleFilter, sortOrder, searchTerm]);

  const loadUsers = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data);
      } else {
        toast.error("Error al cargar usuarios"); // Mostrar error al cargar usuarios
        console.error("Error al cargar usuarios:", await response.text());
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor"); // Mostrar error de conexión
      console.error("Error al cargar usuarios:", error);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name + " " + user.firstname + " " + user.lastname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });

    filtered.sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          toast.success("Usuario eliminado con éxito"); // Mostrar éxito en la eliminación
        } else {
          toast.error("Error al eliminar el usuario"); // Mostrar error si no se elimina correctamente
          console.error("Error al eliminar usuario:", await response.text());
        }
      } catch (error) {
        toast.error("Error al conectar con el servidor"); // Mostrar error de conexión
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Fecha no disponible";
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="user-management">
      <h2>Gestión de Usuarios</h2>
      <div className="filters">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cleaning">Limpieza</option>
          <option value="delivery">Entrega</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
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
      <table className="tableManagement">
        <thead className="theadManagement">
          <tr className="trManagement">
            <th className="thManagement">
              <span>Usuario</span>
            </th>
            <th className="thManagement">
              <span>Rol</span>
            </th>
            <th className="thManagement">
              <span>Email</span>
            </th>
            <th className="thManagement">
              <span>Fecha</span> de Creación
            </th>
            <th className="thManagement">
              <span>Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="tbodyManagement">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="trManagement">
              <td className="tdManagement">{`${user.name} ${user.firstname} ${user.lastname} (${user.username})`}</td>
              <td className="tdManagement">{user.role}</td>
              <td className="tdManagement">{user.email}</td>
              <td className="tdManagement">{formatDate(user.created_at)}</td>
              <td className="tdManagement">
                {/* Mostrar el botón eliminar solo si el usuario actual no es el mismo */}
                {user.id !== userData.id && (
                  <button
                    className="buttonManagement"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón flotante que redirige a la página de registro */}
      <a href="http://localhost:3001/register" className="floating-button">
        +
      </a>
    </div>
  );
};

export default UserManagement;
