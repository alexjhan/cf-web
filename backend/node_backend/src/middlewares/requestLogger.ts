// Middleware de logging básico de solicitudes
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Marca tiempo inicial
  const start = Date.now();
  // Al finalizar respuesta calcula duración
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  // Avanza al siguiente middleware
  next();
}
