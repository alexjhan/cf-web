"""
Script de diagnóstico para encontrar por qué no se detectan los artículos del Título I
"""

import json
import re

def main():
    # Cargar datos originales
    with open('../data_ingest/output/EstatutoUniversitario_UNSAAC_processed.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    content_items = [item for item in raw_data['content'] 
                    if item['text'].strip() and len(item['text'].strip()) > 1]

    print('🔍 DIAGNÓSTICO DE TÍTULOS Y ARTÍCULOS INICIALES')
    print('=' * 60)

    # Buscar todos los títulos
    title_pattern = re.compile(r'^(TÍTULO|Título)\s+[IVX\d]+', re.IGNORECASE)
    article_pattern = re.compile(r'^Artículo\s+\d+[°º]\s*', re.IGNORECASE)

    print('\n📖 TÍTULOS ENCONTRADOS (primeros 5):')
    title_count = 0
    for i, item in enumerate(content_items):
        text = item['text'].strip()
        if title_pattern.match(text):
            title_count += 1
            size = item.get('size', 0)
            font = item.get('font', '')
            print(f'{title_count}. Índice {i}: "{text}"')
            print(f'   Font: {font}, Size: {size}')
            
            # Buscar la línea siguiente para el nombre completo del título
            if i + 1 < len(content_items):
                next_text = content_items[i + 1]['text'].strip()
                next_font = content_items[i + 1].get('font', '')
                next_size = content_items[i + 1].get('size', 0)
                if next_font == font and abs(next_size - size) < 1:
                    print(f'   Continuación: "{next_text}"')
            print()
            
            if title_count >= 5:
                break

    print('\n📄 ARTÍCULOS INICIALES (primeros 10):')
    article_count = 0
    for i, item in enumerate(content_items):
        text = item['text'].strip()
        if article_pattern.match(text):
            article_count += 1
            font = item.get('font', '')
            size = item.get('size', 0)
            print(f'{article_count}. Índice {i}: "{text}"')
            print(f'   Font: {font}, Size: {size}')
            print()
            
            if article_count >= 10:
                break

    # Buscar específicamente el área entre TÍTULO I y los primeros artículos
    print('\n🎯 ÁREA ESPECÍFICA: TÍTULO I hasta primeros artículos')
    print('-' * 50)
    
    titulo_i_index = None
    for i, item in enumerate(content_items):
        text = item['text'].strip()
        if text == "TÍTULO I" and item.get('size', 0) > 13:
            titulo_i_index = i
            break
    
    if titulo_i_index:
        print(f'✅ TÍTULO I encontrado en índice {titulo_i_index}')
        # Mostrar los siguientes 20 elementos para ver qué hay
        for i in range(titulo_i_index, min(titulo_i_index + 20, len(content_items))):
            item = content_items[i]
            text = item['text'].strip()
            font = item.get('font', '')
            size = item.get('size', 0)
            
            marker = ""
            if title_pattern.match(text):
                marker = " 📖 TÍTULO"
            elif article_pattern.match(text):
                marker = " 📄 ARTÍCULO"
                
            print(f'  {i}: "{text}"{marker}')
            print(f'      Font: {font}, Size: {size}')
    else:
        print('❌ No se encontró TÍTULO I con tamaño > 13')

if __name__ == "__main__":
    main()
