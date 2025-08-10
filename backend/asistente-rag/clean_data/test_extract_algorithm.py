"""
Test directo del algoritmo _extract_articles para encontrar dónde está el problema
"""

from legal_document_cleaner import LegalDocumentCleaner
import json

def main():
    cleaner = LegalDocumentCleaner()
    
    # Cargar datos originales
    with open('../data_ingest/output/EstatutoUniversitario_UNSAAC_processed.json', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    content_items = [item for item in raw_data['content'] 
                    if item['text'].strip() and len(item['text'].strip()) > 1]

    print('🔍 TEST DIRECTO DEL ALGORITMO _extract_articles')
    print('=' * 60)
    
    # Crear una versión modificada del algoritmo que imprima debug info
    print('📊 Información básica:')
    print(f'  Total de elementos filtrados: {len(content_items)}')
    
    # Buscar específicamente el área del TÍTULO I
    titulo_i_index = None
    for i, item in enumerate(content_items):
        text = item['text'].strip()
        font = item.get('font', '')
        size = item.get('size', 0)
        if text == "TÍTULO I" and size > 13:
            titulo_i_index = i
            break
    
    print(f'  TÍTULO I encontrado en índice: {titulo_i_index}')
    
    # Simular el algoritmo desde el TÍTULO I
    if titulo_i_index:
        print(f'\n🎯 SIMULANDO ALGORITMO DESDE TÍTULO I (índice {titulo_i_index}):')
        
        current_context = {
            "chapter": "",
            "title": "",
            "section": ""
        }
        
        articles_found = []
        
        # Procesar desde el TÍTULO I hasta encontrar algunos artículos
        for i in range(titulo_i_index, min(titulo_i_index + 50, len(content_items))):
            item = content_items[i]
            text = item['text'].strip()
            font = item.get('font', '')
            size = item.get('size', 0)
            
            # Detectar títulos
            if cleaner._is_title_start(text, font, size):
                # Capturar título completo
                title_text = text
                j = i + 1
                while j < len(content_items) and j < i + 3:
                    next_item = content_items[j]
                    next_text = next_item['text'].strip()
                    next_font = next_item.get('font', '')
                    next_size = next_item.get('size', 0)
                    
                    if (next_font == font and abs(next_size - size) < 1 and 
                        not cleaner._is_chapter(next_text) and 
                        not cleaner._is_article_start(next_text, next_font)):
                        title_text += " " + next_text
                        j += 1
                    else:
                        break
                
                current_context['title'] = title_text
                print(f'  📖 TÍTULO detectado: "{title_text}"')
                
            # Detectar capítulos
            elif cleaner._is_chapter(text):
                current_context['chapter'] = text
                print(f'  📁 CAPÍTULO detectado: "{text}"')
                
            # Detectar artículos
            elif cleaner._is_article_start(text, font):
                articles_found.append({
                    'index': i,
                    'number': text,
                    'context': current_context.copy()
                })
                print(f'  📄 ARTÍCULO detectado: "{text}"')
                print(f'      Contexto: Título="{current_context["title"]}", Capítulo="{current_context["chapter"]}"')
                
                if len(articles_found) >= 5:  # Limitar a 5 artículos para el test
                    break
        
        print(f'\n✅ RESULTADO DEL TEST:')
        print(f'  Artículos encontrados: {len(articles_found)}')
        
        for i, art in enumerate(articles_found):
            print(f'  {i+1}. {art["number"]} - Título: "{art["context"]["title"]}"')

if __name__ == "__main__":
    main()
