import React, { useState } from "react";

/**
 * Formulario para añadir una nueva nota
 * @param {Object} props - Recibe la función para añadir una nota y el ID del usuario
 * @returns {JSX.Element} Componente AddNoteForm
 */
const AddNoteForm = ({ onAddNote, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /**
   * Maneja el envío del formulario
   * @param {Object} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Asegurarse de que el título no sea vacío
    if (!title.trim()) {
      console.error("Error: El título no puede estar vacío.");
      return;
    }

    const newNote = {
      title: title.trim(),
      description: description.trim(),
      user_id: userId,
    };

    onAddNote(newNote);

    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="SharedCard__form">
      {/* Campo de entrada para el título */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la nota (máximo 100 caracteres)"
        maxLength={100} //; Limitar el input del título
        required
      />

      {/* Campo de área de texto para la descripción */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la nota (máximo 800 caracteres)"
        maxLength={800} //; Limitar el input de la descripción
        required
        style={{ height: "184px", resize: "none" }} //; Mayor altura y deshabilitar el redimensionamiento
      />

      {/* Botón de envío */}
      <button type="submit">Añadir Nota</button>
    </form>
  );
};

export default AddNoteForm;
