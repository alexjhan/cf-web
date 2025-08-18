import { Router } from 'express';
import * as controller from '../controllers/asistenteController';

const r = Router();

r.post('/ask', controller.ask);

export default r;
