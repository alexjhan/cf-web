// Rutas para documentos
import { Router } from 'express';
import * as controller from '../controllers/documentosController';
import { authMiddleware } from '../middlewares/authMiddleware';

// Instancia
const r = Router();

// Lectura pública
r.get('/', controller.listar);
r.get('/:id', controller.obtener);
// Escritura protegida
r.post('/', authMiddleware, controller.crear);
r.put('/:id', authMiddleware, controller.actualizar);
r.delete('/:id', authMiddleware, controller.eliminar);

export default r;
