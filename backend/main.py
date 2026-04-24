"""
Backend RSA — FastAPI
Endpoints para generar claves, cifrar y descifrar mensajes con RSA.
"""

from __future__ import annotations

import math
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="RSA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Modelos Pydantic ─────────────────────────────────────────────────────────

class PrimesInput(BaseModel):
    p: int
    q: int


class SelectEInput(BaseModel):
    p: int
    q: int
    e: int


class CipherInput(BaseModel):
    message: str
    e: int
    n: int


class DecipherInput(BaseModel):
    cipher: List[int]
    d: int
    n: int


# ── Funciones RSA ────────────────────────────────────────────────────────────

def es_primo(n: int) -> bool:
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def obtener_valores_e(phi: int, limite: int = 50) -> list[int]:
    valores = []
    for e in range(2, phi):
        if math.gcd(e, phi) == 1:
            valores.append(e)
            if len(valores) >= limite:
                break
    return valores


def pasos_mcd(phi: int, limite_e: int = 30) -> list[dict]:
    """Genera la tabla del cálculo de gcd(e, φ) para e = 2..φ-1."""
    filas = []
    for e in range(2, phi):
        g = math.gcd(e, phi)
        filas.append({
            "e": e,
            "phi": phi,
            "gcd": g,
            "coprimo": g == 1,
        })
        if len(filas) >= limite_e:
            break
    return filas


def calcular_d(e: int, phi: int) -> tuple:
    """Calcula d = (1 + k·φ(n)) / e buscando k que dé entero."""
    pasos = []
    d_result = None
    k_result = None

    for k in range(1, 10 * phi):
        numerador = 1 + k * phi
        es_entero = numerador % e == 0
        valor = numerador // e if es_entero else round(numerador / e, 4)

        if len(pasos) < 20 or es_entero:
            pasos.append({
                "k": k,
                "numerador": numerador,
                "resultado": valor,
                "esEntero": es_entero,
            })

        if es_entero:
            d_result = numerador // e
            k_result = k
            break

    return d_result, k_result, pasos


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/api/generate-keys")
def generate_keys(data: PrimesInput):
    p, q = data.p, data.q
    errores = []

    if not es_primo(p):
        errores.append(f"P = {p} no es un número primo.")
    if not es_primo(q):
        errores.append(f"Q = {q} no es un número primo.")
    if p == q:
        errores.append("P y Q deben ser diferentes.")

    if errores:
        return {"success": False, "errors": errores}

    n = p * q
    phi = (p - 1) * (q - 1)
    valores_e = obtener_valores_e(phi)
    tabla_mcd = pasos_mcd(phi)

    if not valores_e:
        return {"success": False, "errors": ["No se encontraron valores válidos de e."]}

    pasos_iniciales = [
        f"P = {p},  Q = {q}",
        f"n = P × Q = {p} × {q} = {n}",
        f"φ(n) = (P−1)(Q−1) = {p - 1} × {q - 1} = {phi}",
    ]

    return {
        "success": True,
        "n": n,
        "phi": phi,
        "valores_e": valores_e,
        "tabla_mcd": tabla_mcd,
        "pasos": pasos_iniciales,
    }


@app.post("/api/select-e")
def select_e(data: SelectEInput):
    p, q, e = data.p, data.q, data.e
    n = p * q
    phi = (p - 1) * (q - 1)

    if math.gcd(e, phi) != 1:
        return {"success": False, "errors": [f"gcd({e}, {phi}) ≠ 1. Elige otro valor de e."]}

    d, k_found, pasos_d = calcular_d(e, phi)

    if d is None:
        return {"success": False, "errors": ["No se pudo calcular d con este valor de e."]}

    pasos = [
        f"e seleccionado = {e}",
        f"Verificación: gcd({e}, {phi}) = {math.gcd(e, phi)} ✓",
        f"Buscando d tal que d = (1 + k·φ(n)) / e sea entero...",
    ]

    pasos.append(f"d = (1 + {k_found}·{phi}) / {e} = {d}")
    pasos.append(f"Verificación: (d × e) mod φ(n) = ({d} × {e}) mod {phi} = {(d * e) % phi} ✓")
    pasos.append(f"Clave Pública:  ({n}, {e})")
    pasos.append(f"Clave Privada:  ({n}, {d})")

    return {
        "success": True,
        "n": n,
        "phi": phi,
        "e": e,
        "d": d,
        "public_key": {"n": n, "e": e},
        "private_key": {"n": n, "d": d},
        "pasos": pasos,
        "pasos_d": pasos_d,
    }


@app.post("/api/encrypt")
def encrypt(data: CipherInput):
    mensaje = data.message
    e, n = data.e, data.n

    max_ord = max(ord(c) for c in mensaje)
    if max_ord >= n:
        return {
            "success": False,
            "errors": [f"n={n} es muy pequeño para este mensaje (necesita n > {max_ord}). Usa primos más grandes."],
        }

    cifrado = [pow(ord(c), e, n) for c in mensaje]
    pasos = [f"Cifrado: C = M^{e} mod {n}"]
    for i, c in enumerate(mensaje):
        pasos.append(f"  '{c}' (ASCII {ord(c)}) → {ord(c)}^{e} mod {n} = {cifrado[i]}")

    return {
        "success": True,
        "cipher": cifrado,
        "cipher_text": " ".join(str(c) for c in cifrado),
        "pasos": pasos,
    }


@app.post("/api/decrypt")
def decrypt(data: DecipherInput):
    cifrado = data.cipher
    d, n = data.d, data.n

    descifrado_chars = [chr(pow(c, d, n)) for c in cifrado]
    mensaje = "".join(descifrado_chars)

    pasos = [f"Descifrado: M = C^{d} mod {n}"]
    for i, c in enumerate(cifrado):
        pasos.append(f"  {c} → {c}^{d} mod {n} = {ord(descifrado_chars[i])} ('{descifrado_chars[i]}')")

    return {
        "success": True,
        "message": mensaje,
        "pasos": pasos,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
