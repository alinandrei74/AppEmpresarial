import React, { useState, useEffect } from "react";
import AddNoteForm from "./AddNoteForm";
import { toast } from "react-toastify";
import "./Notes.css";

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

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const updateNoteView = (rawNotes) => {
    const sortedNotes = [...rawNotes].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.updated_at) - new Date(b.updated_at)
        : new Date(b.updated_at) - new Date(a.updated_at)
    );
    setNotes(sortedNotes);
  };

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

      const data = await response.json();
      setNotes((prevNotes) => [...prevNotes, data.data]);
      loadNotes();
      toast.success("Nota añadida con éxito");
    } catch (error) {
      console.error("Error adding note:", error.message);
      toast.error("Error al añadir la nota");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (userData.role === "admin") {
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
    }
  };

  return (
    <div className="notes-container">
      <h2>Notas</h2>

      <AddNoteForm onAddNote={handleAddNote} userId={userData.id} />
      <button className="filter-button" onClick={toggleSortOrder}>
        Orden {sortOrder === "asc" ? "Antiguo" : "Reciente"}
      </button>
      <div className="notes-list">
        <div className="info-message">
          <p>Las notas se eliminarán automáticamente después de 24 horas.</p>
        </div>

        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-description">{note.description}</p>
            <small className="smallNotes">
              Por: Usuario {note.user_id} - Creado:{" "}
              {new Date(note.created_at).toLocaleString()} - Actualizado:{" "}
              {new Date(note.updated_at).toLocaleString()}
            </small>
            {userData.role === "admin" && (
              <button
                className="delete-note-button"
                onClick={() => handleDeleteNote(note.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
