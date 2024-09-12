"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const authorizeRole = (roles) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'Token no proporcionado' });
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err)
                return res.status(401).json({ message: 'Token inválido o expirado' });
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
            }
            next();
        });
    };
};
exports.authorizeRole = authorizeRole;
