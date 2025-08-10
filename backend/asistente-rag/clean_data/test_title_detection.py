"""
Test simple de detección de títulos
"""
import re

# Crear el patrón como en el código original
title_pattern = re.compile(r'^(TÍTULO|Título)\s+[IVX\d]+', re.IGNORECASE)

def is_title_start(text, font, size):
    """Función de prueba igual a la del código"""
    return (
        title_pattern.match(text) and 
        font == "Arial-BoldMT" and 
        size > 13
    )

# Test cases
test_cases = [
    ("TÍTULO I", "Arial-BoldMT", 11.039999961853027, "Índice"),
    ("TÍTULO I", "Arial-BoldMT", 14.039999961853027, "Real"),
    ("TÍTULO II", "Arial-BoldMT", 14.039999961853027, "Real"),
]

print("🧪 TEST DE DETECCIÓN DE TÍTULOS")
print("=" * 40)

for text, font, size, tipo in test_cases:
    result = is_title_start(text, font, size)
    print(f"\nTexto: '{text}' ({tipo})")
    print(f"Font: {font}")
    print(f"Size: {size}")
    print(f"Detectado: {result}")
    
    # Verificar condiciones
    pattern_ok = bool(title_pattern.match(text))
    font_ok = font == "Arial-BoldMT"
    size_ok = size > 13
    
    print(f"  - Patrón: {pattern_ok}")
    print(f"  - Font: {font_ok}")
    print(f"  - Size > 13: {size_ok}")
