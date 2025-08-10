"""
Script para corregir el contenido del artículo que se cortó durante la corrección estructural.
"""

import json
import re
from pathlib import Path

def fix_article_content(input_file, output_file):
    """
    Corrige el contenido del artículo que pudo haberse cortado durante la separación.
    """
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Buscar y corregir artículos específicos con contenido cortado
    corrections_made = 0
    
    for chunk in data['chunks']:
        article_number = chunk.get('article_number', '')
        article_title = chunk.get('article_title', '')
        article_content = chunk.get('article_content', '')
        
        # Caso específico del Artículo 4°
        if article_number == "Artículo 4°" and article_title == "Fines de la UNSAAC":
            # El contenido debe empezar con "4.1. Preservar y transmitir..."
            if not article_content.startswith("4.1."):
                # Agregar la parte faltante al inicio
                missing_part = "4.1. Preservar y transmitir de modo permanente la herencia histórica, científica, "
                chunk['article_content'] = missing_part + article_content
                corrections_made += 1
                print(f"✓ Corregido contenido del {article_number}")
                print(f"  Contenido ahora empieza con: {chunk['article_content'][:100]}...")
        
        # Revisar otros artículos que puedan tener problemas similares
        # Si el article_title contiene números de sección (4.1, 5.1, etc.) pero el content no
        if re.match(r'^\d+\.\d+\.', article_title) and not re.match(r'^\d+\.\d+\.', article_content):
            # Mover el contenido del title al content
            chunk['article_content'] = article_title + " " + article_content
            chunk['article_title'] = ""  # Limpiar el título que tenía contenido
            corrections_made += 1
            print(f"✓ Corregido contenido movido desde title en {article_number}")
    
    # Guardar archivo corregido
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Corrección de contenido completada:")
    print(f"   - Correcciones realizadas: {corrections_made}")
    print(f"   - Archivo guardado: {output_file}")
    
    return corrections_made

if __name__ == "__main__":
    # Archivos de entrada y salida
    input_file = Path("output/EstatutoUniversitario_UNSAAC_optimized_fixed.json")
    output_file = Path("output/EstatutoUniversitario_UNSAAC_final_corrected.json")
    
    print("🔧 Iniciando corrección de contenido de artículos...")
    
    if not input_file.exists():
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        exit(1)
    
    try:
        corrected = fix_article_content(input_file, output_file)
        
        if corrected > 0:
            print(f"\n🎯 Se realizaron {corrected} correcciones de contenido")
        else:
            print("\n✨ No se encontraron problemas de contenido para corregir")
            
    except Exception as e:
        print(f"❌ Error durante la corrección: {e}")
