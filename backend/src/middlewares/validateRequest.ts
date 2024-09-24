import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: ObjectSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      console.log("Validation Error Details:", error.details);
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Validation error',
        data: errorMessages,
      });
      
    }
    next();
  };
};
