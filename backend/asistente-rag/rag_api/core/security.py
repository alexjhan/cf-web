"""Funciones de seguridad: verificación del token de administrador.

Centralizamos esto para que cualquier router pueda reutilizarlo sin copiar código.
"""
from __future__ import annotations  # Soporte de anotaciones futuras.
import os  # Para leer variables de entorno.
from fastapi import Request, HTTPException  # Request: acceso a headers; HTTPException: lanzar error HTTP.

# Leemos el token esperado desde variable de entorno. Si está vacío -> modo abierto (no se exige token).
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

def check_admin(request: Request) -> None:  # No devuelve nada; lanza excepción si falla.
    """Verifica el token admin.

    Lógica:
      1. Si no hay ADMIN_TOKEN configurado -> no se exige (modo desarrollo abierto).
      2. Busca header "x-admin-token" (o variante capitalizada) o Authorization: Bearer <token>.
      3. Compara; si no coincide -> 401.
    """
    if not ADMIN_TOKEN:  # Sin token configurado => no forzamos autenticación.
        return
    token = request.headers.get("x-admin-token") or request.headers.get("X-Admin-Token")  # Intenta leer encabezado directo.
    if not token:  # Si no vino, revisamos header Authorization.
        auth = request.headers.get("authorization") or ""  # Puede ser "Bearer abc123".
        if auth.lower().startswith("bearer "):
            token = auth.split(None, 1)[1]  # Extrae la segunda parte (el valor tras Bearer).
    if token != ADMIN_TOKEN:  # Comparación estricta.
        raise HTTPException(status_code=401, detail="Token admin inválido")  # Error si no coincide.
