// Middleware de autenticación simple por token compartido
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Lee token de header personalizado o Bearer
  const token = req.header('X-Admin-Token') || (req.header('Authorization')||'').replace('Bearer ', '');
  // Si hay token configurado y no coincide => 401
  if (ENV.ADMIN_TOKEN && token !== ENV.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  // Continua flujo
  return next();
}
