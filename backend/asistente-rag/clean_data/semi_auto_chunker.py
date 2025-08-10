"""
Fragmentación Semi-Automática
Identifica artículos automáticamente pero permite ajustes manuales
"""

import json
import re

def auto_extract_articles(json_file_path: str):
    """Extrae artículos automáticamente"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Juntar todo el texto
    full_text = ""
    for item in data['content']:
        text = item['text'].strip()
        if text:
            full_text += " " + text
    
    # Buscar artículos con regex
    article_pattern = r'(Artículo\s+\d+[°º]?[^.]*?\.(?:[^.]*\.)*?)(?=Artículo\s+\d+[°º]?|$)'
    articles = re.findall(article_pattern, full_text, re.DOTALL | re.IGNORECASE)
    
    chunks = []
    for i, article in enumerate(articles):
        article = article.strip()
        if len(article) > 50:  # Filtrar artículos muy cortos
            
            # Extraer número de artículo
            match = re.match(r'Artículo\s+(\d+)[°º]?', article, re.IGNORECASE)
            article_num = match.group(1) if match else str(i+1)
            
            chunk = {
                "id": f"article_{article_num}",
                "title": f"Artículo {article_num}°",
                "type": "article",
                "content": article,
                "word_count": len(article.split())
            }
            chunks.append(chunk)
    
    return chunks

def create_editable_template(chunks: list, output_file: str):
    """Crea plantilla editable con artículos pre-identificados"""
    
    template = """# FRAGMENTACIÓN SEMI-AUTOMÁTICA - ARTÍCULOS IDENTIFICADOS

## INSTRUCCIONES:
1. Revisa cada artículo identificado automáticamente
2. Ajusta el contenido si es necesario
3. Agrega chunks adicionales (capítulos, secciones) al final
4. Mantén el formato ---CHUNK_START--- / ---CHUNK_END---

## ARTÍCULOS IDENTIFICADOS:

"""
    
    for chunk in chunks:
        template += f"""---CHUNK_START---
TÍTULO: {chunk['title']}
TIPO: {chunk['type']}
CONTENIDO:
{chunk['content']}
---CHUNK_END---

"""
    
    template += """
## AGREGA AQUÍ CHUNKS ADICIONALES (CAPÍTULOS, TÍTULOS, ETC.):

---CHUNK_START---
TÍTULO: [Título del chunk adicional]
TIPO: [chapter/title/section]
CONTENIDO:
[Contenido aquí]
---CHUNK_END---

"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(template)

def main():
    """Generar fragmentación semi-automática"""
    
    json_file = "../data_ingest/output/EstatutoUniversitario_UNSAAC_processed.json"
    
    print("🔄 Identificando artículos automáticamente...")
    chunks = auto_extract_articles(json_file)
    
    output_file = "manual_chunking/estatuto_semi_auto.txt"
    create_editable_template(chunks, output_file)
    
    print(f"✅ Plantilla semi-automática creada: {output_file}")
    print(f"📊 Artículos identificados: {len(chunks)}")
    print(f"\n📋 Primeros artículos:")
    for chunk in chunks[:5]:
        print(f"  - {chunk['title']} ({chunk['word_count']} palabras)")
    
    print(f"\n📝 SIGUIENTE PASO:")
    print(f"1. Edita: {output_file}")
    print(f"2. Ajusta artículos si es necesario")
    print(f"3. Agrega capítulos/títulos al final")
    print(f"4. Ejecuta: python convert_manual_chunks.py")

if __name__ == "__main__":
    main()
