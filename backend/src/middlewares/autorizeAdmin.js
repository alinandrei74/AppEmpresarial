"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const authorizeAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        logger_1.default.warning('Acceso denegado: Se requiere rol de administrador');
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            status: http_status_codes_1.StatusCodes.FORBIDDEN,
            message: 'Acceso denegado: Se requiere rol de administrador',
            data: null,
        });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
