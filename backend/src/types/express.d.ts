// src/types/express.d.ts
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Cambia 'any' al tipo de tu usuario si lo conoces
    }
  }
}

//! Preguntar Moises