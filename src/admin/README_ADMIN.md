# Área de Administración (estructura propuesta)

Objetivo: centralizar CRUD de recursos (documentos, noticias, oportunidades, especialidades) con componentes reutilizables.

## Estructura
```
src/
  admin/
    pages/              # Páginas específicas (AdminDocumentos, AdminNoticias...)
    components/         # Componentes reutilizables (AdminLayout, DataTable, FormField...)
    hooks/              # Hooks específicos admin (useCrud, useDebounce, useAuthAdmin)
    services/           # (opcional) wrappers específicos que usen los services globales
    README_ADMIN.md
```

## Convenciones
- Cada página CRUD usa el hook genérico `useCrud` (pendiente crear) o su propio estado local simple.
- Formularios controlados, validación mínima antes de llamar al backend.
- Token admin almacenado en `localStorage.ADMIN_TOKEN`.
- Todos los fetch usan services en `src/services/*`.

## Próximos pasos sugeridos
1. Crear `components/AdminLayout.tsx` con encabezado y navegación lateral.
2. Extraer tabla y formulario en componentes reutilizables.
3. Implementar hook `useDebounce` para búsquedas.
4. Crear páginas restantes: AdminNoticias, AdminOportunidades con el mismo patrón.
5. Añadir feedback (toasts) y confirm dialogs más amigables.

## Estados típicos por recurso
- list: { items, total, page, pageSize }
- form: payload (todos los campos)
- editingId: string | null
- loading/saving/error: flags

## Estándar de nombres
- Archivos de página: `Admin<Resource>.tsx` en `admin/pages`.
- Servicios front: `services/<recurso>Service.ts`.
- Dominio backend: usar mismo nombre de tabla.

---
Este documento crecerá conforme añadimos más recursos.
