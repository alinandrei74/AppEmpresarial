"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const validateRequest = (schema, property = 'body', schemaName = 'unknown schema') => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req[property], { abortEarly: false });
            if (error) {
                // Generar detalles de errores incluyendo el esquema y la propiedad
                const errorDetails = error.details.map((detail) => ({
                    message: detail.message,
                    path: detail.path.join('.'),
                    type: detail.type,
                    context: detail.context,
                    schemaName: schemaName, // Añadir el nombre del esquema
                    property: property, // Añadir la propiedad que se está validando (body, params, query)
                }));
                // Imprimir los detalles del error en la consola para depuración
                console.log(`Validation Error in schema: ${schemaName}, property: ${property}`, errorDetails);
                // Enviar la respuesta de error con detalles adicionales
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: `Validation error in schema: ${schemaName}, property: ${property}`,
                    data: errorDetails,
                });
            }
            next();
        }
        catch (err) {
            // Capturar errores inesperados durante la validación y enviar una respuesta genérica
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: `Internal server error while validating schema: ${schemaName}, property: ${property}`,
                error: err,
            });
        }
    };
};
exports.validateRequest = validateRequest;
