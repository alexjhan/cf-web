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

## Desarrollo
Instalar dependencias y levantar el entorno:
```bash
pnpm install # o npm install
pnpm dev
```

## Backend Integration

Environment variables (copy `.env.example` to `.env`):

```
VITE_API_URL=http://localhost:8000
VITE_ADMIN_TOKEN=SECRETO
```

APIs consumidas actualmente:

| Recurso | Endpoint base | Métodos usados |
|---------|---------------|----------------|
| Noticias | /news | GET, POST, PUT, DELETE |
| Documentos | /api/documentos | GET, POST, PUT, DELETE |
| Oportunidades | /oportunidades | GET, POST, PUT, DELETE |

Cabecera para autenticación admin: `X-Admin-Token: <VITE_ADMIN_TOKEN>`.

Si cambian los endpoints ajustar archivos en `src/services/*Service.ts`.

## Licencia
Uso interno académico del Centro Federado.

## SEO / Aparición en Google
Para que "Centro Federado Ingeniería Metalúrgica" aparezca en búsquedas:
1. Dominio y HTTPS: despliega el build en un dominio estable (ej: `cfim-metalurgia.pe`) con certificado SSL.
2. Meta tags: el archivo `index.html` ya incluye meta `description`, `keywords`, OpenGraph y JSON-LD básico.
3. Sitemap: genera un `sitemap.xml` con rutas principales (`/inicio`, `/carrera`, `/noticias`, etc.) y súbelo a la raíz.
4. robots.txt: crea un `robots.txt` permitiendo indexación y referencia al sitemap.
5. Search Console: verifica propiedad del dominio en Google Search Console (etiqueta HTML o DNS TXT) y envía sitemap.
6. Performance: asegura tiempos de carga óptimos (usa build de producción `npm run build`).
7. Contenido único: redacta descripciones ricas en la palabra clave "Ingeniería Metalúrgica" en páginas clave.
8. Favicon y OpenGraph: ya configurados; opcional añadir imágenes específicas por página.
9. Enlaces externos: consigue enlaces desde la página oficial de la Facultad / Universidad para autoridad.
10. Actualizaciones: publica noticias periódicas para que Google detecte frescura del sitio.

Archivos sugeridos a agregar en la raíz de producción:
```
robots.txt
User-agent: *
Allow: /
Sitemap: https://www.ejemplo-dominio-cfim.pe/sitemap.xml
```

Ejemplo mínimo de `sitemap.xml`:
```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://www.ejemplo-dominio-cfim.pe/</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/inicio</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/carrera</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/noticias</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/cursos</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/oportunidades</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/documentos</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/especialidades</loc></url>
	<url><loc>https://www.ejemplo-dominio-cfim.pe/representacion</loc></url>
</urlset>
```

Puedes automatizar el sitemap generándolo desde el router o un script Node si las rutas crecen.
