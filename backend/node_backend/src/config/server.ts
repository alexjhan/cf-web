// Configuración del servidor Express (creación y middlewares globales)
import express from 'express';
import cors from 'cors';
import { router as apiRouter } from '../routes';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { notFound } from '../middlewares/notFound';
import { requestLogger } from '../middlewares/requestLogger';

// Fabrica y devuelve instancia de Express configurada
export function buildServer() {
  // Crea app
  const app = express();
  // Habilita CORS solo para el frontend de Netlify
  app.use(cors({
    origin: 'https://centro-federado.netlify.app/',
    credentials: true
  }));
  // Parser JSON
  app.use(express.json());
  // Logger sencillo de cada request
  app.use(requestLogger);
  // Monta rutas de la API
  app.use('/api', apiRouter);
  // 404 explícito
  app.use(notFound);
  // Manejo centralizado de errores
  app.use(errorMiddleware);
  // Devuelve instancia lista
  return app;
}
