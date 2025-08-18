// Middleware para rutas no encontradas (404)
import { Request, Response, NextFunction } from 'express';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: 'not_found' });
}
