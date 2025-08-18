-- Schema bootstrap for Supabase (noticias & oportunidades)
-- Run chunks manually in Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Table: noticias
create table if not exists public.noticias (
  id uuid primary key default uuid_generate_v4(),
  fecha date not null,
  titulo text not null,
  descripcion_corta text not null,
  descripcion_larga text not null,
  autor text not null,
  categorias text[] not null default '{}',
  imagen text,
  destacada boolean not null default false,
  vistas integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_set_updated_at_noticias on public.noticias;
create trigger trg_set_updated_at_noticias before update on public.noticias for each row execute procedure public.set_updated_at();

create index if not exists idx_noticias_created_at on public.noticias (created_at desc);

create table if not exists public.oportunidades (
  id uuid primary key default uuid_generate_v4(),
  categoria text not null,
  titulo text not null,
  fecha_publicacion date not null,
  requisitos text[] not null default '{}',
  beneficios text[] not null default '{}',
  activa boolean not null default true,
  empresa text,
  texto text,
  contacto text,
  institucion text,
  duracion text,
  tipo_estudio text,
  contenido text,
  fecha date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_oportunidades on public.oportunidades;
create trigger trg_set_updated_at_oportunidades before update on public.oportunidades for each row execute procedure public.set_updated_at();

create index if not exists idx_oportunidades_created_at on public.oportunidades (created_at desc);

-- Optional GIN indices for array columns if heavy filtering later
-- create index if not exists idx_noticias_categorias on public.noticias using gin (categorias);
-- create index if not exists idx_oportunidades_requisitos on public.oportunidades using gin (requisitos);

-- Table: documentos
create table if not exists public.documentos (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  subtitulo text,
  tipo text not null,
  fecha date not null,
  peso text not null,
  link text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_set_updated_at_documentos on public.documentos;
create trigger trg_set_updated_at_documentos before update on public.documentos for each row execute procedure public.set_updated_at();

create index if not exists idx_documentos_created_at on public.documentos (created_at desc);
