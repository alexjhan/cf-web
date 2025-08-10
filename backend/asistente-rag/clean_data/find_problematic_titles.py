#!/usr/bin/env python3
"""
Script para identificar artículos con títulos problemáticos que parecen ser contenido.
"""

import json
import re

def has_problematic_title(title):
    """
    Identifica si un título parece ser contenido en lugar de un título real.
    """
    if title == "No tienen título":
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

def analyze_titles(json_file):
    """
    Analiza todos los títulos en el archivo JSON.
    """
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    problematic_articles = []
    
    for chunk in data['chunks']:
        if 'article_number' in chunk and 'article_title' in chunk:
            article_number = chunk['article_number']
            article_title = chunk['article_title']
            article_content = chunk.get('article_content', '')
            
            if has_problematic_title(article_title):
                problematic_articles.append({
                    'article_number': article_number,
                    'article_title': article_title,
                    'article_content': article_content[:100] + '...' if len(article_content) > 100 else article_content,
                    'title_length': len(article_title)
                })
    
    return problematic_articles

def main():
    input_file = 'output/EstatutoUniversitario_UNSAAC_fully_corrected.json'
    
    print("Analizando títulos problemáticos...")
    problematic = analyze_titles(input_file)
    
    print(f"\nSe encontraron {len(problematic)} artículos con títulos problemáticos:\n")
    
    for article in problematic:
        print(f"- {article['article_number']}")
        print(f"  Título problemático: \"{article['article_title']}\"")
        print(f"  Longitud: {article['title_length']} caracteres")
        print(f"  Contenido: {article['article_content']}")
        print()

if __name__ == '__main__':
    main()
