# CF Web

Aplicación web del Centro Federado (EPIMT) construida con React, TypeScript, Vite y TailwindCSS.

## Tecnologías principales
- React 19 + TypeScript
- Vite 7
- TailwindCSS 4
- React Router DOM 7
- @xyflow/react (mapa curricular interactivo)

## Scripts
- `pnpm dev` / `npm run dev` Inicia entorno de desarrollo
- `pnpm build` Compila la aplicación para producción
- `pnpm preview` Sirve el build localmente
- `pnpm lint` Linter de código

## Estructura destacada
- `src/pages` Páginas principales (Carrera, Cursos, Documentos, Representacion, Noticias, Oportunidades, etc.)
- `src/components` Componentes UI reutilizables
- `src/services` Servicios (ej. chatbot)
- `backend/asistente-rag` Pipelines y API RAG para asistente

## Desarrollo
Instalar dependencias y levantar el entorno:
```bash
pnpm install # o npm install
pnpm dev
```

## Licencia
Uso interno académico del Centro Federado.
