// Punto de entrada: crea servidor y lo inicia
import { buildServer } from './config/server';
import { ENV } from './config/env';

// Construye instancia Express configurada
const app = buildServer();
// Usa el puerto asignado por Railway o fallback
const PORT = process.env.PORT || ENV.PORT || 4000;
app.listen(Number(PORT), () => {
  console.log(`API listening on :${PORT}`);
});
