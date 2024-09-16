"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const authorizeRole = (roles) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Token no proporcionado',
                data: null,
            });
        }
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'Token inválido o expirado',
                    data: null,
                });
            }
            if (!decoded || !roles.includes(decoded.role)) {
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                    status: http_status_codes_1.StatusCodes.FORBIDDEN,
                    message: 'No tienes permiso para acceder a esta ruta',
                    data: null,
                });
            }
            next();
        });
    };
};
exports.authorizeRole = authorizeRole;
