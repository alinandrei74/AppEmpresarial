"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'No token provided',
            data: null,
        });
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Server configuration error: ACCESS_TOKEN_SECRET is missing',
            data: null,
        });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                status: http_status_codes_1.StatusCodes.FORBIDDEN,
                message: 'Invalid token',
                data: null,
            });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
