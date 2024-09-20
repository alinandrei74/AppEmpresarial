import React, { useState } from "react";

const AddNoteForm = ({ onAddNote, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = { title, description, user_id: userId };
    console.log("Submitting new note:", newNote); // Debugging log
    onAddNote(newNote);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-note-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la nota"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la nota"
        required
      />
      <button type="submit">Añadir Nota</button>
    </form>
  );
};

export default AddNoteForm;