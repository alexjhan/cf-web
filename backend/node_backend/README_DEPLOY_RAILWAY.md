# Deploy backend en Railway

1. Sube solo esta carpeta (`backend/node_backend`) a un nuevo repositorio en GitHub (o haz push de solo esta carpeta).
2. En Railway, crea un nuevo proyecto y selecciona ese repo/carpeta.
3. Railway detectará este `package.json` y usará:
   - `npm run build` → compila TypeScript a `dist/`
   - `npm start` → ejecuta `dist/index.js`
4. Agrega tus variables de entorno en Railway (sin PORT).
5. ¡Listo! Tu backend Express quedará desplegado y accesible desde la URL pública de Railway.

## Scripts relevantes

```json
"scripts": {
  "dev": "tsx src/index.ts",
  "start": "node dist/index.js",
  "build": "tsc -p tsconfig.json"
}
```

## Estructura esperada

```
backend/node_backend/
├── dist/
│   └── index.js
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── ...
```

No necesitas modificar nada más. Si tienes dudas, consulta este archivo o pide ayuda.
