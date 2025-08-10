"""
Convertidor de chunks manuales a formato JSON para RAG
Lee la plantilla editada manualmente y crea el JSON final
"""

import json
import re
import os

def parse_manual_chunks(template_file: str) -> list:
    """Parsea los chunks manuales del archivo de plantilla"""
    
    with open(template_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Buscar chunks usando regex
    chunk_pattern = r'---CHUNK_START---(.*?)---CHUNK_END---'
    chunks_raw = re.findall(chunk_pattern, content, re.DOTALL)
    
    chunks = []
    
    for i, chunk_raw in enumerate(chunks_raw):
        # Parsear cada chunk
        lines = chunk_raw.strip().split('\n')
        
        chunk_data = {
            "id": f"chunk_{i+1:03d}",
            "title": "",
            "type": "content",
            "content": "",
            "word_count": 0
        }
        
        current_section = None
        content_lines = []
        
        for line in lines:
            line = line.strip()
            
            if line.startswith('TÍTULO:'):
                chunk_data['title'] = line.replace('TÍTULO:', '').strip()
            elif line.startswith('TIPO:'):
                chunk_data['type'] = line.replace('TIPO:', '').strip()
            elif line.startswith('CONTENIDO:'):
                current_section = 'content'
            elif current_section == 'content' and line:
                content_lines.append(line)
        
        # Unir contenido
        chunk_data['content'] = '\n'.join(content_lines).strip()
        chunk_data['word_count'] = len(chunk_data['content'].split())
        
        # Solo agregar chunks con contenido válido
        if chunk_data['content'] and chunk_data['word_count'] > 10:
            chunks.append(chunk_data)
    
    return chunks

def create_final_json(chunks: list, source_file: str, output_file: str):
    """Crea el JSON final optimizado para RAG"""
    
    final_data = {
        "source_file": source_file,
        "processing_type": "manual_chunking",
        "total_chunks": len(chunks),
        "chunks": chunks,
        "metadata": {
            "creation_date": "2025-08-06",
            "method": "manual_fragmentation",
            "total_words": sum(chunk['word_count'] for chunk in chunks),
            "avg_words_per_chunk": sum(chunk['word_count'] for chunk in chunks) / len(chunks) if chunks else 0
        }
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    
    return final_data

def main():
    """Convertir chunks manuales a JSON"""
    
    template_file = "manual_chunking/estatuto_plantilla_manual.txt"
    
    if not os.path.exists(template_file):
        print(f"❌ Archivo no encontrado: {template_file}")
        print("Primero debes completar la fragmentación manual.")
        return
    
    print("🔄 Procesando chunks manuales...")
    
    try:
        # Parsear chunks
        chunks = parse_manual_chunks(template_file)
        
        if not chunks:
            print("⚠️ No se encontraron chunks válidos en el archivo.")
            print("Asegúrate de usar el formato:")
            print("---CHUNK_START---")
            print("TÍTULO: [título]")
            print("TIPO: [tipo]")
            print("CONTENIDO:")
            print("[contenido]")
            print("---CHUNK_END---")
            return
        
        # Crear JSON final
        output_file = "output/EstatutoUniversitario_UNSAAC_manual_cleaned.json"
        final_data = create_final_json(
            chunks, 
            "EstatutoUniversitario_UNSAAC.pdf",
            output_file
        )
        
        print(f"✅ JSON final creado: {output_file}")
        print(f"📊 Total de chunks: {final_data['total_chunks']}")
        print(f"📝 Total de palabras: {final_data['metadata']['total_words']}")
        print(f"📈 Promedio por chunk: {final_data['metadata']['avg_words_per_chunk']:.1f} palabras")
        
        # Mostrar primeros chunks
        print(f"\n📋 Primeros chunks:")
        for i, chunk in enumerate(chunks[:3]):
            print(f"  {i+1}. {chunk['title']} ({chunk['word_count']} palabras)")
        
    except Exception as e:
        print(f"❌ Error procesando: {e}")

if __name__ == "__main__":
    main()
