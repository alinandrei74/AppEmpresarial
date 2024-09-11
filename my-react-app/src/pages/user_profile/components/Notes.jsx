import React, { useState, useEffect } from "react";
import { getNotes, addNote, deleteNote } from "../../../data_base/mockDatabase";
import AddNoteForm from "./AddNoteForm";
import "./Notes.css";

const Notes = ({ role, userId }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Cargar las notas al montar el componente
    loadNotes();
  }, []);

  const loadNotes = () => {
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
  };

  const handleAddNote = (newNote) => {
    const addedNote = addNote({ ...newNote, userId });
    setNotes(prevNotes => [...prevNotes, addedNote]);
  };

  const handleDeleteNote = (noteId) => {
    if (role === "admin") {
      const deleted = deleteNote(noteId);
      if (deleted) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      }
    }
  };

  return (
    <div className="notes-container">
      <h2>Notas</h2>
      <AddNoteForm onAddNote={handleAddNote} />
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <p>{note.content}</p>
            <small>Por: {note.userName} - {new Date(note.timestamp).toLocaleString()}</small>
            {role === "admin" && (
              <button onClick={() => handleDeleteNote(note.id)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;