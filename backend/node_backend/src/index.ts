// Punto de entrada: crea servidor y lo inicia
import { buildServer } from './config/server';
import { ENV } from './config/env';

// Construye instancia Express configurada
const app = buildServer();
// Levanta escucha en puerto definido
app.listen(Number(ENV.PORT), () => {
  console.log(`API listening on :${ENV.PORT}`);
});
