#!/usr/bin/env python3
"""
Script para corregir automáticamente todos los artículos con títulos problemáticos.
"""

import json
import re

def has_problematic_title(title):
    """
    Identifica si un título parece ser contenido en lugar de un título real.
    """
    if title == "No tienen título" or title == "no tiene":
        return False
    
    # Patrones que indican que es contenido, no título
    problematic_patterns = [
        r'\b(son|está|están|puede|pueden|tiene|tienen|debe|deben|será|serán|es)\b',
        r'\b(comprende|comprenden|corresponde|corresponden|requiere|requieren)\b',
        r'\b(incluye|incluyen|establece|establecen|especifica|especifican)\b',
        r'\b(realiza|realizan|desarrolla|desarrollan|ejecuta|ejecutan)\b',
        r'\b(proporciona|proporcionan|ofrece|ofrecen|brinda|brindan)\b',
        r'\b(permite|permiten|garantiza|garantizan|asegura|aseguran)\b',
        r'\b(designa|designan|elige|eligen|nombra|nombran)\b',
        r',$',  # Termina con coma
        r':\s*$',  # Termina con dos puntos
    ]
    
    # Verificar si el título es muy largo (probablemente contenido)
    if len(title) > 80:
        return True
    
    # Verificar patrones problemáticos
    for pattern in problematic_patterns:
        if re.search(pattern, title, re.IGNORECASE):
            return True
    
    # Verificar si tiene múltiples comas (señal de ser una lista o contenido complejo)
    if title.count(',') >= 3:
        return True
    
    return False

def fix_problematic_titles(json_file, output_file):
    """
    Corrige todos los títulos problemáticos en el archivo JSON.
    """
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    corrections_count = 0
    corrected_articles = []
    
    for chunk in data['chunks']:
        if 'article_number' in chunk and 'article_title' in chunk:
            article_number = chunk['article_number']
            article_title = chunk['article_title']
            article_content = chunk.get('article_content', '')
            
            if has_problematic_title(article_title):
                # Combinar el título problemático con el contenido
                if article_title == "no tiene":
                    # Caso especial para títulos que ya están marcados como "no tiene"
                    chunk['article_title'] = "No tienen título"
                else:
                    # Combinar título y contenido
                    combined_content = f"{article_title} {article_content}".strip()
                    chunk['article_title'] = "No tienen título"
                    chunk['article_content'] = combined_content
                    
                    # Actualizar word_count
                    chunk['word_count'] = len(combined_content.split())
                
                corrections_count += 1
                corrected_articles.append({
                    'article_number': article_number,
                    'old_title': article_title,
                    'new_title': chunk['article_title'],
                    'new_content': chunk['article_content'][:100] + '...' if len(chunk['article_content']) > 100 else chunk['article_content']
                })
    
    # Guardar el archivo corregido
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return corrections_count, corrected_articles

def main():
    input_file = 'output/EstatutoUniversitario_UNSAAC_fully_corrected.json'
    output_file = 'output/EstatutoUniversitario_UNSAAC_final_corrected.json'
    
    print("Corrigiendo títulos problemáticos...")
    corrections_count, corrected_articles = fix_problematic_titles(input_file, output_file)
    
    print(f"\nSe corrigieron {corrections_count} artículos:")
    
    for article in corrected_articles[:10]:  # Mostrar solo los primeros 10
        print(f"\n- {article['article_number']}")
        print(f"  Título anterior: \"{article['old_title']}\"")
        print(f"  Título nuevo: \"{article['new_title']}\"")
        print(f"  Contenido actualizado: {article['new_content']}")
    
    if len(corrected_articles) > 10:
        print(f"\n... y {len(corrected_articles) - 10} artículos más.")
    
    print(f"\nArchivo corregido guardado como: {output_file}")

if __name__ == '__main__':
    main()
