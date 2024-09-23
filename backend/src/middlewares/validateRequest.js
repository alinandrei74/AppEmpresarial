"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Validation error',
                data: errorMessages,
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
