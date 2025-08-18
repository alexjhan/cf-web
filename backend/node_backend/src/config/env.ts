// Carga variables de entorno y valida su esquema
import { config } from 'dotenv';
import { z } from 'zod';

// Carga .env en process.env
config();

// Define y valida variables esperadas
const EnvSchema = z.object({
  PORT: z.string().default('4000'),
  ADMIN_TOKEN: z.string().min(1, 'ADMIN_TOKEN required').optional(),
});

// Exporta objeto tipado de entorno
export const ENV = EnvSchema.parse(process.env);
