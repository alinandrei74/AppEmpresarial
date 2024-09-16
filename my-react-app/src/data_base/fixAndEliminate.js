//! ⚠️ AVISO IMPORTANTE (11/09/2024)
//? Este archivo contiene funciones que interactúan directamente con el localStorage para manejar datos como notas y tareas.
//? Estas funciones están aquí para permitir que la aplicación funcione temporalmente, pero NO representan la implementación final deseada.

//todo 📌 Este código debe ser eliminado y migrado para utilizar la lógica centralizada en el archivo `mockDatabase.mjs`.
// La lógica de negocio debe manejarse a través de los controladores simulados definidos en `mockDatabase.mjs` para asegurar consistencia, reutilización de código y
// mejor manejo de estado.

//* ❗ NOTA: Asegúrate de reemplazar estas funciones por sus equivalentes en `mockDatabase.mjs` para mantener la arquitectura y lógica de la aplicación alineada con las mejores prácticas.

// Función para obtener las notas del localStorage
const getNotesFromStorage = () => {
  const notes = localStorage.getItem("notes");
  return notes ? JSON.parse(notes) : [];
};

// Función para guardar las notas en el localStorage
const saveNotesToStorage = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

// Inicializar las notas si no existen en localStorage
if (!localStorage.getItem("notes")) {
  const initialNotes = [
    {
      id: "note-1",
      content:
        "Recordatorio: Revisar el inventario de suministros de limpieza.",
      userId: "uuid-2",
      userName: "Limpieza",
      timestamp: new Date("2024-09-01T10:00:00").getTime(),
    },
    {
      id: "note-2",
      content:
        "La habitación 301 necesita mantenimiento en el aire acondicionado.",
      userId: "uuid-4",
      created_at: "Mantenimiento",
      updated_at: new Date("2024-09-02T14:30:00").getTime(),
    },
  ];
  saveNotesToStorage(initialNotes);
}

// Función para obtener todas las notas
export const getNotes = () => {
  return getNotesFromStorage();
};

// Función para añadir una nueva nota
export const addNote = (noteData) => {
  const notes = getNotesFromStorage();
  const newNote = {
    id: `note-${uuidv4()}`,
    ...noteData,
    timestamp: new Date().getTime(),
  };
  notes.push(newNote);
  saveNotesToStorage(notes);
  return newNote;
};

// Función para eliminar una nota
export const deleteNote = (noteId) => {
  const notes = getNotesFromStorage();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  if (updatedNotes.length < notes.length) {
    saveNotesToStorage(updatedNotes);
    return true;
  }
  return false;
};

