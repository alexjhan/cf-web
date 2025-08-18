# Supabase Setup (Plan Gratuito)

Guía paso a paso para migrar de SQLite local a Supabase (Postgres gestionado) manteniendo FastAPI.

## 1. Crear proyecto
1. Ir a https://supabase.com/ > Sign In > New project.
2. Elegir nombre, región cercana y contraseña (guardar). Plan free.
3. Esperar a que se aprovisione la base.

## 2. Obtener credenciales
En Project Settings > API:
- `anon public` key (para frontend si lo usas directo) 
- `service_role` key (NO exponer en frontend).
En Project Settings > Database:
- Connection string: formato `postgresql://postgres:<PASSWORD>@<HOST>:6543/postgres` (puede variar el puerto).

Configura en tu `.env` del backend:
```
DATABASE_URL=postgresql+psycopg://postgres:<PASSWORD>@<HOST>:6543/postgres
ADMIN_TOKEN=<tu_token_admin>
```

## 3. Activar extensiones (pgvector)
En SQL Editor ejecuta:
```sql
create extension if not exists vector;
```
(Para futuro: almacenamiento de embeddings.)

## 4. Esquema inicial
Ejecuta en SQL Editor:
```sql
create table if not exists news (
  id text primary key,
  fecha date not null,
  titulo text not null,
  descripcion_corta text not null,
  descripcion_larga text not null,
  autor text not null,
  categoria jsonb not null,
  imagen text,
  destacada boolean default false,
  vistas int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_news_fecha on news(fecha);
create index if not exists idx_news_destacada on news(destacada);

create table if not exists oportunidades (
  id text primary key,
  titulo text not null,
  descripcion text not null,
  tipo text not null,
  fecha_publicacion date not null,
  fecha_cierre date,
  fuente text,
  enlace text,
  estado text not null default 'abierta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_op_fecha_pub on oportunidades(fecha_publicacion);
create index if not exists idx_op_fecha_cierre on oportunidades(fecha_cierre);
create index if not exists idx_op_tipo on oportunidades(tipo);
create index if not exists idx_op_estado on oportunidades(estado);

create table if not exists documentos (
  id text primary key,
  titulo text not null,
  categoria text not null,
  version text,
  fecha date,
  autor text,
  resumen text,
  archivo_path text,
  hash text,
  estado text default 'vigente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_documentos_categoria on documentos(categoria);
create index if not exists idx_documentos_hash on documentos(hash);

-- Futuro: fragmentos + embeddings vector
create table if not exists fragmentos (
  id text primary key,
  source_type text not null,
  source_id text not null,
  titulo text,
  texto text not null,
  checksum text,
  tokens int,
  embedding vector(384), -- siempre que uses MiniLM 384 dims
  created_at timestamptz not null default now()
);
create index if not exists idx_fragmentos_source on fragmentos(source_type, source_id);
create index if not exists idx_fragmentos_checksum on fragmentos(checksum);
```

## 5. Migrar datos desde SQLite
Exporta cada tabla a CSV (script rápido) y súbelo con Table Editor (Import data).
Ejemplo export local (Python):
```python
import sqlite3, csv
conn = sqlite3.connect('news.db')
for table in ['news','oportunidades']:
    with open(f'{table}.csv','w',newline='',encoding='utf-8') as f:
        w=csv.writer(f)
        cur=conn.execute(f'select * from {table}')
        w.writerow([d[0] for d in cur.description])
        w.writerows(cur.fetchall())
conn.close()
```
Luego en Supabase: Table Editor > Import CSV.

## 6. Ajustar backend para usar Postgres
Crea módulo `db.py` (SQLAlchemy) y reescribe funciones para usar ese engine o bien usa psycopg directo.

## 7. Embeddings en pgvector (futuro)
Al insertar fragmento:
```sql
insert into fragmentos (id, source_type, source_id, titulo, texto, checksum, tokens, embedding)
values (..., to_vector(:embedding));
```
Búsqueda:
```sql
select id, source_type, source_id, titulo, texto, 1 - (embedding <=> to_vector(:query_vec)) as score
from fragmentos
order by embedding <-> to_vector(:query_vec)
limit 5;
```

## 8. Seguridad
- Usa RLS (Row Level Security) sólo cuando abras acceso directo desde frontend.
- Para backend propio, desactiva RLS o crea policies explícitas.

## 9. Backups
Supabase hace backups automáticos daily (plan free retención corta). Para mayor control, puedes programar un export manual usando pg_dump en un workflow externo.

## 10. Próximos pasos
1. Implementar `db.py` (engine). 
2. Migrar news_store a Postgres condicional si DATABASE_URL está definido. 
3. Añadir fragmentos y búsqueda vectorial.

---
Checklist rápida:
[ ] Crear proyecto
[ ] Extension vector
[ ] Ejecutar SQL esquema
[ ] Exportar CSV SQLite
[ ] Importar a Supabase
[ ] Configurar .env backend
[ ] Probar conexión
[ ] Migrar funciones CRUD

## Ampliación para modelo enriquecido (Frontend actual)

Si ya migraste al esquema minimalista pero el frontend necesita campos extra (noticias: descripcion_corta, descripcion_larga, categorias[], imagen, destacada, vistas; oportunidades: requisitos[], beneficios[], activa, empresa, institucion, etc.) aplica:

```sql
-- Extensión noticias
alter table public.noticias
  add column if not exists fecha date,
  add column if not exists descripcion_corta text,
  add column if not exists descripcion_larga text,
  add column if not exists autor text,
  add column if not exists categorias text[] default '{}',
  add column if not exists imagen text,
  add column if not exists destacada boolean default false,
  add column if not exists vistas integer default 0;

-- Extensión oportunidades
alter table public.oportunidades
  add column if not exists categoria text,
  add column if not exists fecha_publicacion date,
  add column if not exists requisitos text[] default '{}',
  add column if not exists beneficios text[] default '{}',
  add column if not exists activa boolean default true,
  add column if not exists empresa text,
  add column if not exists texto text,
  add column if not exists contacto text,
  add column if not exists institucion text,
  add column if not exists duracion text,
  add column if not exists tipo_estudio text,
  add column if not exists contenido text,
  add column if not exists fecha date;

create index if not exists idx_noticias_categorias on public.noticias using gin(categorias);
```

Verifica RLS/policies para nuevas columnas si RLS está activo.
