import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (
  schema: ObjectSchema, 
  property: 'body' | 'params' | 'query' = 'body', 
  schemaName: string = 'unknown schema'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: `Validation error in schema: ${schemaName}, property: ${property}`,
          data: errorDetails,
        });
      }
      next();
    } catch (err) {
      // Capturar errores inesperados durante la validación y enviar una respuesta genérica
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: `Internal server error while validating schema: ${schemaName}, property: ${property}`,
        error: err,
      });
    }
  };
};
