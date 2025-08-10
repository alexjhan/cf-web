"""
Test simple para debuggear la detección de artículos
"""
import re

def test_article_detection():
    # Patrón original del código
    article_pattern = re.compile(r'^Artículo\s+\d+[°º]\s*$', re.IGNORECASE)
    
    # Test cases basados en lo que vimos en el diagnóstico
    test_cases = [
        "Artículo 1° Objeto del Estatuto",  # Texto real del documento
        "Artículo 1°",                      # Versión simplificada
        "Artículo 2° Definición de la UNSAAC",
        "Artículo 13°",                     # Este sabemos que funciona
    ]
    
    print("🧪 TEST DE DETECCIÓN DE ARTÍCULOS")
    print("=" * 40)
    
    for text in test_cases:
        match = article_pattern.match(text)
        print(f"\nTexto: '{text}'")
        print(f"¿Coincide patrón? {bool(match)}")
        print(f"Patrón: ^Artículo\\s+\\d+[°º]\\s*$")
        
        # El problema puede ser que el patrón espera que termine ahí ($)
        # pero el texto real incluye el título del artículo
        
        # Probemos un patrón más flexible
        flexible_pattern = re.compile(r'^Artículo\s+\d+[°º]\s*', re.IGNORECASE)
        flexible_match = flexible_pattern.match(text)
        print(f"¿Coincide patrón flexible? {bool(flexible_match)}")

if __name__ == "__main__":
    test_article_detection()
