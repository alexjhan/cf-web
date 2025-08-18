// Controlador del asistente (placeholder RAG)
import { Request, Response } from 'express';

// POST /api/asistente/ask
export async function ask(req: Request, res: Response) {
  // TODO: Implementar pipeline RAG (embed -> buscar -> generar)
  return res.json({ answer: 'placeholder', question: req.body?.question || '' });
}
