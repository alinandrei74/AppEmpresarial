"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const db_1 = require("../config/db");
// Obtener todas las notas
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield db_1.db.any('SELECT * FROM notes');
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getNotes = getNotes;
// Obtener una nota por ID
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const note = yield db_1.db.oneOrNone('SELECT * FROM notes WHERE id = $1', [id]);
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getNoteById = getNoteById;
// Crear una nueva nota
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, userId } = req.body;
    try {
        const result = yield db_1.db.one('INSERT INTO notes (content, user_id) VALUES ($1, $2) RETURNING id', [content, userId]);
        res.status(201).json({ id: result.id, content, userId });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createNote = createNote;
// Actualizar una nota existente
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const result = yield db_1.db.result('UPDATE notes SET content = $1 WHERE id = $2', [content, id]);
        if (result.rowCount) {
            res.json({ message: 'Note updated' });
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateNote = updateNote;
// Eliminar una nota
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.db.result('DELETE FROM notes WHERE id = $1', [id]);
        if (result.rowCount) {
            res.json({ message: 'Note deleted' });
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteNote = deleteNote;
