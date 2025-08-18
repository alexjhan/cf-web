# Node Backend

Estructura base generada (controllers, routes, services, middlewares, etc.) para migración o coexistencia con backend Python.

## Scripts
- `npm run dev` (tsx watch)
- `npm run build` (tsc)
- `npm start` (ejecuta compilado)

## Variables de entorno (.env)
Ver `.env.example`. Requeridos: `PORT`, `ADMIN_TOKEN`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (o `SUPABASE_SERVICE_KEY`).

## Estado actual
- Controllers `noticias`, `oportunidades`, `documentos` conectados a Supabase vía `supabaseService`.
- Validación Zod para create/update en `domain/`.
- Rutas de mutación protegidas con `authMiddleware` (header `X-Admin-Token` o `Authorization: Bearer`).
- Servicio genérico CRUD paginado (`supabaseService`).

## Tablas recomendadas Supabase (SQL)
```sql
create extension if not exists "uuid-ossp";

create table if not exists noticias (
	id uuid primary key default uuid_generate_v4(),
	titulo text not null,
	contenido text not null,
	fuente text,
	url text,
	created_at timestamptz default now(),
	updated_at timestamptz
);

create table if not exists oportunidades (
	id uuid primary key default uuid_generate_v4(),
	titulo text not null,
	descripcion text not null,
	categoria text,
	url text,
	fecha_cierre date,
	created_at timestamptz default now(),
	updated_at timestamptz
);

create table if not exists documentos (
	id uuid primary key default uuid_generate_v4(),
	titulo text not null,
	subtitulo text,
	tipo text not null check (tipo in ('academico','administrativo','reglamento','formulario','guia','convenio')),
	fecha date not null,
	peso text not null, -- guardar en texto human readable (o bytes como texto)
	link text not null,
	created_at timestamptz default now(),
	updated_at timestamptz
);

-- Índices recomendados
create index if not exists documentos_tipo_idx on documentos(tipo);
create index if not exists documentos_fecha_idx on documentos(fecha);

-- Trigger updated_at (opcional)
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger noticias_updated before update on noticias
	for each row execute function set_updated_at();
create trigger oportunidades_updated before update on oportunidades
	for each row execute function set_updated_at();
create trigger documentos_updated before update on documentos
	for each row execute function set_updated_at();
```

## Próximos pasos sugeridos
1. Añadir tests Vitest para controllers (mock supabase).
2. Añadir búsqueda avanzada (texto completo) o vector search futuras tablas embeddings.
3. Implementar endpoint `/asistente/ask` con pipeline RAG.
4. Rate limiting básico y CORS específico.
5. Reemplazar service genérico por repositories si se necesitan queries complejas.

## Tests
Ejecutar:
```
npm test
```
Actualmente cubre controladores de noticias, oportunidades y documentos con mocks del servicio Supabase.

## Directorios creados
- config: servidor y carga env
- routes: define endpoints y agrupa routers
- controllers: orquestación de cada dominio
- middlewares: auth, logger, errores
- services: (pendiente rellenar) lógica negocio / integraciones
- domain: (pendiente) esquemas zod / tipos
- repositories: (pendiente) consultas a BD
- rag / llm: (pendiente) pipeline RAG y clientes LLM
- utils / errors / jobs / workers: utilidades futuras

Base funcional lista; faltan pruebas y RAG.
