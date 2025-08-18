// Router raíz que agrega los routers de cada dominio
import { Router } from 'express';
import noticiasRoutes from './noticiasRoutes';
import oportunidadesRoutes from './oportunidadesRoutes';
import documentosRoutes from './documentosRoutes';
import asistenteRoutes from './asistenteRoutes';

// Instancia principal del router
export const router = Router();
// Monta subrutas por recurso
router.use('/noticias', noticiasRoutes);
router.use('/oportunidades', oportunidadesRoutes);
router.use('/documentos', documentosRoutes);
router.use('/asistente', asistenteRoutes);
