import React, { useState } from "react";

const AddNoteForm = ({ onAddNote }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onAddNote({ content });
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-note-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe una nueva nota..."
        required
      />
      <button type="submit">Añadir Nota</button>
    </form>
  );
};

export default AddNoteForm;