"""
Script para identificar y corregir artículos con títulos que son realmente contenido.
Busca títulos muy largos o que terminan con preposiciones, indicando que son contenido cortado.
"""

import json
import re
from pathlib import Path

def identify_content_as_title(input_file, output_file):
    """
    Identifica artículos donde el title es realmente contenido y los marca como "No tienen título".
    """
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    corrected_count = 0
    problematic_titles = []
    
    # Patrones que indican que un título es realmente contenido
    content_patterns = [
        r'.+ a$',  # Termina con " a"
        r'.+ de$', # Termina con " de"
        r'.+ en$', # Termina con " en"
        r'.+ la$', # Termina con " la"
        r'.+ el$', # Termina con " el"
        r'.+ y$',  # Termina con " y"
        r'.+ que$', # Termina con " que"
        r'.+ son$', # Termina con " son"
        r'.+ para$', # Termina con " para"
        r'.+ con$', # Termina con " con"
        r'.+ del$', # Termina con " del"
        r'.+ las$', # Termina con " las"
        r'.+ los$', # Termina con " los"
        r'.+ una$', # Termina con " una"
        r'.+ un$',  # Termina con " un"
    ]
    
    for i, chunk in enumerate(data['chunks']):
        article_number = chunk.get('article_number', '')
        article_title = chunk.get('article_title', '').strip()
        article_content = chunk.get('article_content', '')
        
        # Verificar si es un artículo
        if re.match(r'^Artículo\s+\d+[°º]', article_number):
            
            # Casos problemáticos:
            # 1. Título muy largo (más de 80 caracteres)
            # 2. Título que termina con preposiciones o conectores
            # 3. Título que parece ser una oración completa
            
            is_problematic = False
            reason = ""
            
            if len(article_title) > 80:
                is_problematic = True
                reason = "Título muy largo"
            
            # Verificar patrones de contenido
            for pattern in content_patterns:
                if re.match(pattern, article_title, re.IGNORECASE):
                    is_problematic = True
                    reason = f"Termina con preposición/conector: '{article_title.split()[-1]}'"
                    break
            
            # Verificar si contiene múltiples comas (indica lista o contenido)
            if article_title.count(',') >= 2:
                is_problematic = True
                reason = "Contiene múltiples comas (parece contenido)"
            
            if is_problematic:
                # Mover el título problemático al contenido y marcar como sin título
                if article_title not in article_content:
                    # Agregar el título al inicio del contenido si no está ya ahí
                    chunk['article_content'] = article_title + " " + article_content
                
                chunk['article_title'] = "No tienen título"
                corrected_count += 1
                
                problematic_titles.append({
                    'article_number': article_number,
                    'original_title': article_title,
                    'reason': reason,
                    'content_preview': chunk['article_content'][:100] + "..."
                })
                
                print(f"✓ {article_number}: {reason}")
                print(f"   Título original: {article_title[:60]}...")
    
    # Guardar archivo corregido
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Corrección de títulos problemáticos completada:")
    print(f"   - Artículos corregidos: {corrected_count}")
    print(f"   - Archivo guardado: {output_file}")
    
    if problematic_titles:
        print(f"\n📋 Resumen de correcciones:")
        for item in problematic_titles:
            print(f"   {item['article_number']}: {item['reason']}")
    
    return corrected_count, problematic_titles

def analyze_title_lengths(input_file):
    """
    Analiza las longitudes de los títulos para identificar patrones.
    """
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    title_lengths = []
    long_titles = []
    preposition_endings = []
    
    for chunk in data['chunks']:
        article_number = chunk.get('article_number', '')
        article_title = chunk.get('article_title', '').strip()
        
        if re.match(r'^Artículo\s+\d+[°º]', article_number):
            title_lengths.append(len(article_title))
            
            if len(article_title) > 60:
                long_titles.append(f"{article_number}: {article_title}")
            
            # Verificar terminaciones problemáticas
            if re.search(r'\b(a|de|en|la|el|y|que|son|para|con|del|las|los|una|un)$', article_title, re.IGNORECASE):
                preposition_endings.append(f"{article_number}: ...{article_title[-20:]}")
    
    print(f"📊 Análisis de títulos:")
    print(f"   - Longitud promedio: {sum(title_lengths)/len(title_lengths):.1f} caracteres")
    print(f"   - Títulos muy largos (>60 chars): {len(long_titles)}")
    print(f"   - Títulos con terminaciones problemáticas: {len(preposition_endings)}")
    
    if long_titles:
        print(f"\n📏 Títulos muy largos:")
        for title in long_titles[:5]:  # Mostrar primeros 5
            print(f"   {title}")
    
    if preposition_endings:
        print(f"\n⚠️ Títulos con terminaciones problemáticas:")
        for title in preposition_endings[:5]:  # Mostrar primeros 5
            print(f"   {title}")

if __name__ == "__main__":
    # Archivos de entrada y salida
    input_file = Path("./output/EstatutoUniversitario_UNSAAC_optimized_final.json")
    output_file = Path("./output/EstatutoUniversitario_UNSAAC_fully_corrected.json")
    
    print("🔍 Analizando longitudes y patrones de títulos...")
    analyze_title_lengths(input_file)
    
    print("\n🔧 Iniciando corrección de títulos problemáticos...")
    
    if not input_file.exists():
        print(f"❌ Error: No se encuentra el archivo {input_file}")
        exit(1)
    
    try:
        corrected, items = identify_content_as_title(input_file, output_file)
        
        if corrected > 0:
            print(f"\n🎯 Se corrigieron {corrected} artículos con títulos problemáticos")
        else:
            print("\n✨ No se encontraron títulos problemáticos")
            
    except Exception as e:
        print(f"❌ Error durante la corrección: {e}")
