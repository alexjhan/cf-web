"""
Limpiador Mejorado - Más agresivo en la agrupación de contenido
"""

import json
import re
from typing import List, Dict, Any

class ImprovedDocumentCleaner:
    
    def __init__(self):
        self.article_pattern = re.compile(r'^(Artículo|Art\.?)\s*\d+[°º]?\s*[.-]?', re.IGNORECASE)
        self.chapter_pattern = re.compile(r'^(CAPÍTULO|Capítulo|TÍTULO|Título)\s*[IVX\d]+', re.IGNORECASE)
        
    def clean_document(self, json_file_path: str) -> Dict[str, Any]:
        """Limpia un documento con agrupación más inteligente"""
        
        with open(json_file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        # Filtrar elementos vacíos
        content_items = [item for item in raw_data['content'] 
                        if item['text'].strip() and len(item['text'].strip()) > 1]
        
        # Agrupar de manera más agresiva
        grouped_content = self._smart_grouping(content_items)
        
        # Crear chunks finales
        final_chunks = self._create_final_chunks(grouped_content)
        
        return {
            "source_file": raw_data['file'],
            "total_chunks": len(final_chunks),
            "chunks": final_chunks,
            "metadata": {
                "original_spans": len(raw_data['content']),
                "filtered_spans": len(content_items),
                "grouped_paragraphs": len(grouped_content),
                "final_chunks": len(final_chunks)
            }
        }
    
    def _smart_grouping(self, content_items: List[Dict]) -> List[Dict]:
        """Agrupa contenido de manera inteligente"""
        
        groups = []
        current_group = {
            "text": "",
            "type": "content",
            "spans": []
        }
        
        i = 0
        while i < len(content_items):
            item = content_items[i]
            text = item['text'].strip()
            
            # Detectar inicio de nueva sección importante
            is_new_section = (
                self._is_major_title(text, item) or
                self._is_article_start(text) or
                self._is_chapter_start(text)
            )
            
            # Si encontramos nueva sección y ya tenemos contenido
            if is_new_section and current_group['text'].strip():
                # Guardar grupo actual
                current_group['text'] = current_group['text'].strip()
                if current_group['text']:
                    groups.append(current_group)
                
                # Nuevo grupo
                current_group = {
                    "text": text,
                    "type": self._classify_content(text),
                    "spans": [item]
                }
            else:
                # Continuar agrupando
                if current_group['text'] and not current_group['text'].endswith(' '):
                    current_group['text'] += ' '
                current_group['text'] += text
                current_group['spans'].append(item)
            
            # Para artículos, agrupar las siguientes líneas hasta el próximo artículo
            if self._is_article_start(text):
                current_group['type'] = 'article'
                # Buscar contenido del artículo
                i += 1
                while i < len(content_items):
                    next_item = content_items[i]
                    next_text = next_item['text'].strip()
                    
                    # Parar si encontramos otro artículo o sección mayor
                    if (self._is_article_start(next_text) or 
                        self._is_chapter_start(next_text) or
                        self._is_major_title(next_text, next_item)):
                        i -= 1  # Retroceder para procesar en la próxima iteración
                        break
                    
                    # Agregar al artículo actual
                    if current_group['text'] and not current_group['text'].endswith(' '):
                        current_group['text'] += ' '
                    current_group['text'] += next_text
                    current_group['spans'].append(next_item)
                    i += 1
            
            i += 1
        
        # Agregar último grupo
        if current_group['text'].strip():
            current_group['text'] = current_group['text'].strip()
            groups.append(current_group)
        
        return groups
    
    def _is_major_title(self, text: str, item: Dict) -> bool:
        """Detecta títulos principales"""
        return (
            (len(text) < 100 and text.isupper()) or
            item.get('size', 0) > 16 or
            self.chapter_pattern.match(text)
        )
    
    def _is_article_start(self, text: str) -> bool:
        """Detecta inicio de artículo"""
        return bool(self.article_pattern.match(text))
    
    def _is_chapter_start(self, text: str) -> bool:
        """Detecta inicio de capítulo"""
        return bool(self.chapter_pattern.match(text))
    
    def _classify_content(self, text: str) -> str:
        """Clasifica el tipo de contenido"""
        if self._is_chapter_start(text):
            return 'chapter'
        elif self._is_article_start(text):
            return 'article'
        elif len(text) < 100 and text.isupper():
            return 'title'
        else:
            return 'content'
    
    def _create_final_chunks(self, grouped_content: List[Dict]) -> List[Dict]:
        """Crea chunks finales optimizados para RAG"""
        
        chunks = []
        current_chunk = {
            "content": "",
            "title": "",
            "type": "content",
            "word_count": 0
        }
        
        for group in grouped_content:
            text = group['text']
            content_type = group['type']
            word_count = len(text.split())
            
            # Si es un título o capítulo, empezar nuevo chunk
            if content_type in ['title', 'chapter']:
                # Guardar chunk anterior si tiene contenido sustancial
                if current_chunk['content'].strip() and current_chunk['word_count'] > 10:
                    chunks.append(current_chunk.copy())
                
                # Nuevo chunk
                current_chunk = {
                    "content": text,
                    "title": text,
                    "type": content_type,
                    "word_count": word_count
                }
            else:
                # Agregar al chunk actual
                if current_chunk['content']:
                    current_chunk['content'] += '\n\n' + text
                else:
                    current_chunk['content'] = text
                
                current_chunk['word_count'] += word_count
                
                # Si el chunk es muy largo, dividirlo (manteniendo el título)
                if current_chunk['word_count'] > 600:
                    chunks.append(current_chunk.copy())
                    current_chunk = {
                        "content": "",
                        "title": current_chunk['title'],
                        "type": "content",
                        "word_count": 0
                    }
        
        # Agregar último chunk
        if current_chunk['content'].strip() and current_chunk['word_count'] > 10:
            chunks.append(current_chunk)
        
        return chunks

def main():
    """Procesar documentos con el limpiador mejorado"""
    import os
    
    cleaner = ImprovedDocumentCleaner()
    
    # Crear carpeta de salida
    os.makedirs("output", exist_ok=True)
    
    # Procesar documentos
    input_folder = "../data_ingest/output"
    processed_files = [f for f in os.listdir(input_folder) if f.endswith("_processed.json")]
    
    for json_filename in processed_files:
        json_file = os.path.join(input_folder, json_filename)
        print(f"\n🔄 Procesando: {json_filename}")
        
        try:
            cleaned_doc = cleaner.clean_document(json_file)
            
            # Guardar resultado
            output_filename = json_filename.replace("_processed.json", "_improved_cleaned.json")
            output_file = os.path.join("output", output_filename)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(cleaned_doc, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Guardado: {output_file}")
            print(f"   📊 Chunks: {cleaned_doc['total_chunks']}")
            print(f"   📈 Spans: {cleaned_doc['metadata']['original_spans']} → {cleaned_doc['metadata']['final_chunks']}")
            
            # Mostrar ejemplo del Artículo 97°
            if "Estatuto" in json_filename:
                print(f"\n🔍 Buscando Artículo 97°...")
                for i, chunk in enumerate(cleaned_doc['chunks']):
                    if 'Artículo 97' in chunk['content']:
                        print(f"✅ Encontrado en chunk {i+1}:")
                        print(f"Título: {chunk['title']}")
                        print(f"Contenido: {chunk['content'][:300]}...")
                        break
                        
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print(f"\n🎉 ¡Procesamiento mejorado completado!")

if __name__ == "__main__":
    main()
