"""
Script para regenerar el archivo del Estatuto con información de títulos incluida
"""

from legal_document_cleaner import LegalDocumentCleaner
import json

def main():
    print('🔧 Regenerando Estatuto con títulos incluidos...')
    
    # Crear instancia del cleaner
    cleaner = LegalDocumentCleaner()
    
    # Procesar el estatuto
    input_file = '../data_ingest/output/EstatutoUniversitario_UNSAAC_processed.json'
    result = cleaner.clean_document(input_file)
    
    # Guardar resultado con títulos
    output_file = 'output/EstatutoUniversitario_UNSAAC_legal_cleaned_with_titles.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Archivo generado: {output_file}')
    print(f'📊 Total de chunks: {result["total_chunks"]}')
    
    # Mostrar estadísticas de títulos
    titles_count = {}
    chapters_count = {}
    
    for chunk in result['chunks']:
        title = chunk['context']['title']
        chapter = chunk['context']['chapter']
        
        if title:
            titles_count[title] = titles_count.get(title, 0) + 1
        if chapter:
            chapters_count[chapter] = chapters_count.get(chapter, 0) + 1
    
    print(f'\n📊 TÍTULOS detectados: {len(titles_count)}')
    for title, count in sorted(titles_count.items()):
        print(f'   📖 {title}: {count} artículos')
    
    print(f'\n📊 CAPÍTULOS detectados: {len(chapters_count)}')
    for chapter, count in sorted(chapters_count.items()):
        print(f'   📁 {chapter}: {count} artículos')
    
    # Mostrar ejemplo de chunk con título
    print('\n🔍 EJEMPLO DE CHUNK CON TÍTULO:')
    for chunk in result['chunks'][:5]:
        if chunk['context']['title']:
            print(f"   Artículo: {chunk['article_number']}")
            print(f"   Título: {chunk['context']['title']}")
            print(f"   Capítulo: {chunk['context']['chapter']}")
            print(f"   Contenido: {chunk['content'][:100]}...")
            break

if __name__ == "__main__":
    main()
