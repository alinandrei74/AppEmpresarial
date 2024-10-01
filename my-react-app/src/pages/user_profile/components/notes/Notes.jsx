import React, { useState, useEffect } from "react";
import AddNoteForm from "./AddNoteForm";
import { toast } from "react-toastify";
import "./Notes.css";

/**
 * Componente para mostrar y gestionar notas.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.userData - Datos del usuario actual.
 * @param {string} props.userData.role - Rol del usuario (admin o no admin).
 * @param {string} props.userData.id - ID del usuario.
 */
const Notes = ({ userData }) => {
  const [notes, setNotes] = useState([]);
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem("sortOrderNote") || "asc"
  );

  useEffect(() => {
    loadNotes();

    const interval = setInterval(() => {
      console.log("Actualizando notas...");
      loadNotes();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("sortOrderNote", sortOrder);
    updateNoteView(notes);
  }, [sortOrder]);

  /**
   * Alterna el orden de clasificación de las notas.
   */
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  /**
   * Actualiza la vista de las notas ordenadas por fecha.
   * @param {Array} rawNotes - Notas sin procesar.
   */
  const updateNoteView = (rawNotes) => {
    const sortedNotes = [...rawNotes].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.updated_at) - new Date(b.updated_at)
        : new Date(b.updated_at) - new Date(a.updated_at)
    );
    setNotes(sortedNotes);
  };

  /**
   * Carga las notas desde el servidor.
   */
  const loadNotes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching notes: " + response.statusText);
      }

      const notesResult = await response.json();
      updateNoteView(notesResult.data);
    } catch (error) {
      console.error("Error al cargar notas:", error.message);
      toast.error("Error al cargar las notas");
    }
  };

  const handleAddNote = async (newNote) => {
    try {
      const response = await fetch("http://localhost:3000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add note");
      }

      // const data = await response.json();
      // setNotes((prevNotes) => [...prevNotes, data.data]);

      // await response.json(); //; No necesitas usar el dato para actualizar manualmente

      //; Simplemente llama a loadNotes para actualizar la lista de notas desde el servidor
      loadNotes();
      toast.success("Nota añadida con éxito");
    } catch (error) {
      console.error("Error adding note:", error.message);
      toast.error("Error al añadir la nota");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      toast.success("Nota eliminada con éxito");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error al eliminar la nota");
    }
  };

  return (
    <div className="SharedCard__card-background notes-container">
      <h2 className="SharedCard__title">Notas</h2>

      <div className="SharedCard__card-first-layer">
        <AddNoteForm onAddNote={handleAddNote} userId={userData.id} />
        <div className="SharedCard__filter-button-div">
          <button onClick={toggleSortOrder}>
            Orden {sortOrder === "asc" ? "Antiguo" : "Reciente"}
          </button>
        </div>
      </div>

      <div className="SharedCard__note">
        <p id="info">
          Las notas se eliminarán automáticamente después de 24 horas.
        </p>
      </div>
      <br />

      <div className="SharedCard__items-list">
        {notes.map((note) => {
          return (
            <div key={note.id} className="SharedCard__item">
              <div className="SharedCard__item-user-div">
                <h1>
                  {note.user_id === userData.id ? "(TÚ)" : note.user_name}
                </h1>
                {note.user_role !== "unknown" && (
                  <div className={`user-role-tag ${note.user_role}`}>
                    {note.user_role}
                  </div>
                )}
              </div>

              <h1>{note.title}</h1>
              <h2>{note.description}</h2>

              {/* Mostrar botón de eliminar solo si el usuario es admin o si la nota pertenece al usuario */}
              {(userData.role === "admin" || userData.id === note.user_id) && (
                <button
                  className="SharedCard__delete-button"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notes;
