"""Security helpers (admin token verification).

Centralized so routers don't depend on main.py directly.
"""
from __future__ import annotations
import os
from fastapi import Request, HTTPException

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

def check_admin(request: Request) -> None:
    """Validate admin token if one is configured.

    If ADMIN_TOKEN env var is empty, validation is bypassed (open admin mode).
    Accepts either header: X-Admin-Token, x-admin-token or Bearer token.
    Raises HTTPException 401 if invalid.
    """
    if not ADMIN_TOKEN:
        return
    token = request.headers.get("x-admin-token") or request.headers.get("X-Admin-Token")
    if not token:
        auth = request.headers.get("authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(None, 1)[1]
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Token admin inválido")
