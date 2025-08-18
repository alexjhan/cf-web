// Definición de rutas para noticias
import { Router } from 'express';
import * as controller from '../controllers/noticiasController';
import { authMiddleware } from '../middlewares/authMiddleware';

// Crea router específico
const r = Router();

// Rutas públicas de lectura
r.get('/', controller.listar);
r.get('/:id', controller.obtener);
// Rutas protegidas de escritura
r.post('/', authMiddleware, controller.crear);
r.put('/:id', authMiddleware, controller.actualizar);
r.delete('/:id', authMiddleware, controller.eliminar);

// Exporta router
export default r;
