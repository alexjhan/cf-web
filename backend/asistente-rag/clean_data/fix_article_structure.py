"""
Script para corregir la estructura de artículos en el JSON optimizado.
Separa correctamente article_number y article_title cuando están mezclados.
"""

import json
import re
from pathlib import Path

def fix_article_structure(input_file, output_file):
    """
    Corrige la estructura de los artículos separando número y título correctamente.
    
    Problema:
    - article_number: "Artículo 4° Fines de la UNSAAC" 
    - article_title: "4.1. Preservar y transmitir..."
    
    Solución:
    - article_number: "Artículo 4°"
    - article_title: "Fines de la UNSAAC"
    """
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    corrected_count = 0
    
    for chunk in data['chunks']:
        article_number = chunk.get('article_number', '')
        article_title = chunk.get('article_title', '')
        
        # Patrón para detectar: "Artículo X° Título del artículo"
        pattern = r'^(Artículo\s+\d+[°º])\s+(.+)$'
        match = re.match(pattern, article_number)
        
        if match:
            # Separar número y título
            clean_number = match.group(1)  # "Artículo X°"
            extracted_title = match.group(2)  # "Título del artículo"
            
            # Actualizar los campos
            chunk['article_number'] = clean_number
            chunk['article_title'] = extracted_title
            
            corrected_count += 1
            print(f"✓ Corregido: {clean_number} -> {extracted_title}")
    
    # Guardar archivo corregido
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Corrección completada:")
    print(f"   - Artículos corregidos: {corrected_count}")
    print(f"   - Archivo guardado: {output_file}")
    
    return corrected_count

if __name__ == "__main__":
    # Archivos de entrada y salida
    input_file = Path("output/EstatutoUniversitario_UNSAAC_optimized.json")
    output_file = Path("output/EstatutoUniversitario_UNSAAC_optimized_fixed.json")
    
    print("🔧 Iniciando corrección de estructura de artículos...")
    
    if not input_file.exists():
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        exit(1)
    
    try:
        corrected = fix_article_structure(input_file, output_file)
        
        if corrected > 0:
            print(f"\n🎯 Se corrigieron {corrected} artículos con estructura incorrecta")
        else:
            print("\n✨ No se encontraron artículos con estructura incorrecta")
            
    except Exception as e:
        print(f"❌ Error durante la corrección: {e}")
