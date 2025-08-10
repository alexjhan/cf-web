"""
Document Cleaner for RAG System
Agrupa y limpia el contenido extraído de PDFs para crear chunks coherentes
"""

import json
import re
from typing import List, Dict, Any
from utils import DocumentUtils

class DocumentCleaner:
    def __init__(self):
        self.utils = DocumentUtils()
        
    def clean_document(self, json_file_path: str) -> Dict[str, Any]:
        """
        Limpia y estructura un documento JSON extraído de PDF
        
        Args:
            json_file_path: Ruta al archivo JSON procesado
            
        Returns:
            Documento limpio con chunks coherentes
        """
        with open(json_file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            
        # Filtrar elementos vacíos o con poco contenido
        content_items = [item for item in raw_data['content'] 
                        if item['text'].strip() and len(item['text'].strip()) > 2]
        
        # Agrupar spans en párrafos coherentes
        grouped_content = self._group_spans_into_paragraphs(content_items)
        
        # Identificar estructura del documento
        structured_content = self._identify_document_structure(grouped_content)
        
        # Crear chunks para RAG
        rag_chunks = self._create_rag_chunks(structured_content)
        
        return {
            "source_file": raw_data['file'],
            "total_elements": len(content_items),
            "structured_content": structured_content,
            "rag_chunks": rag_chunks,
            "metadata": {
                "processing_stats": {
                    "original_spans": len(raw_data['content']),
                    "filtered_spans": len(content_items),
                    "final_chunks": len(rag_chunks)
                }
            }
        }
    
    def _group_spans_into_paragraphs(self, content_items: List[Dict]) -> List[Dict]:
        """
        Agrupa spans consecutivos en párrafos coherentes
        """
        if not content_items:
            return []
            
        paragraphs = []
        current_paragraph = {
            "text": "",
            "spans": [],
            "dominant_format": None
        }
        
        for i, item in enumerate(content_items):
            text = item['text'].strip()
            
            # Saltear elementos muy pequeños o espacios
            if len(text) <= 2:
                continue
                
            # Detectar fin de párrafo
            is_paragraph_end = (
                self.utils.is_sentence_end(text) or
                self.utils.is_title_or_header(item) or
                self.utils.is_article_number(text) or
                (i > 0 and self.utils.format_changed_significantly(content_items[i-1], item))
            )
            
            # Si es inicio de nuevo párrafo y ya tenemos contenido
            if (is_paragraph_end and current_paragraph['text']) or \
               (self.utils.is_title_or_header(item) and current_paragraph['text']):
                
                # Guardar párrafo actual
                if current_paragraph['text'].strip():
                    current_paragraph['text'] = current_paragraph['text'].strip()
                    current_paragraph['dominant_format'] = self.utils.get_dominant_format(current_paragraph['spans'])
                    paragraphs.append(current_paragraph)
                
                # Iniciar nuevo párrafo
                current_paragraph = {
                    "text": text,
                    "spans": [item],
                    "dominant_format": None
                }
            else:
                # Continuar párrafo actual
                if current_paragraph['text']:
                    # Agregar espacio si es necesario
                    if not current_paragraph['text'].endswith(' ') and not text.startswith(' '):
                        current_paragraph['text'] += ' '
                current_paragraph['text'] += text
                current_paragraph['spans'].append(item)
        
        # Agregar último párrafo
        if current_paragraph['text'].strip():
            current_paragraph['text'] = current_paragraph['text'].strip()
            current_paragraph['dominant_format'] = self.utils.get_dominant_format(current_paragraph['spans'])
            paragraphs.append(current_paragraph)
            
        return paragraphs
    
    def _identify_document_structure(self, paragraphs: List[Dict]) -> List[Dict]:
        """
        Identifica la estructura del documento (títulos, artículos, etc.)
        """
        structured = []
        
        for paragraph in paragraphs:
            text = paragraph['text']
            format_info = paragraph['dominant_format']
            
            # Clasificar tipo de contenido
            content_type = self.utils.classify_content_type(text, format_info)
            
            structured_item = {
                "text": text,
                "type": content_type,
                "format": format_info,
                "word_count": len(text.split()),
                "metadata": {
                    "is_title": content_type in ['title', 'subtitle', 'chapter'],
                    "is_article": content_type == 'article',
                    "is_list_item": content_type == 'list_item',
                    "importance_score": self.utils.calculate_importance_score(text, format_info, content_type)
                }
            }
            
            structured.append(structured_item)
            
        return structured
    
    def _create_rag_chunks(self, structured_content: List[Dict]) -> List[Dict]:
        """
        Crea chunks optimizados para RAG
        """
        chunks = []
        current_chunk = {
            "content": "",
            "title": "",
            "type": "content",
            "metadata": {
                "word_count": 0,
                "has_title": False,
                "importance_score": 0
            }
        }
        
        for item in structured_content:
            text = item['text']
            content_type = item['type']
            
            # Si es un título, empezar nuevo chunk
            if item['metadata']['is_title']:
                # Guardar chunk anterior si tiene contenido
                if current_chunk['content'].strip():
                    chunks.append(current_chunk.copy())
                
                # Nuevo chunk con título
                current_chunk = {
                    "content": text,
                    "title": text,
                    "type": content_type,
                    "metadata": {
                        "word_count": len(text.split()),
                        "has_title": True,
                        "importance_score": item['metadata']['importance_score']
                    }
                }
            else:
                # Agregar al chunk actual
                if current_chunk['content']:
                    current_chunk['content'] += '\n\n' + text
                else:
                    current_chunk['content'] = text
                    
                current_chunk['metadata']['word_count'] += len(text.split())
                current_chunk['metadata']['importance_score'] = max(
                    current_chunk['metadata']['importance_score'],
                    item['metadata']['importance_score']
                )
                
                # Si el chunk es muy largo, dividirlo
                if current_chunk['metadata']['word_count'] > 800:  # ~3200 chars aprox
                    chunks.append(current_chunk.copy())
                    current_chunk = {
                        "content": "",
                        "title": current_chunk['title'],  # Mantener título
                        "type": "content",
                        "metadata": {
                            "word_count": 0,
                            "has_title": bool(current_chunk['title']),
                            "importance_score": 0
                        }
                    }
        
        # Agregar último chunk
        if current_chunk['content'].strip():
            chunks.append(current_chunk)
            
        return chunks

def main():
    """Ejemplo de uso"""
    import os
    
    cleaner = DocumentCleaner()
    
    # Crear carpeta output si no existe
    os.makedirs("output", exist_ok=True)
    
    # Procesar todos los archivos JSON procesados
    input_folder = "../data_ingest/output"
    processed_files = [f for f in os.listdir(input_folder) if f.endswith("_processed.json")]
    
    for json_filename in processed_files:
        json_file = os.path.join(input_folder, json_filename)
        print(f"\nLimpiando documento: {json_filename}")
        
        try:
            cleaned_doc = cleaner.clean_document(json_file)
            
            # Guardar resultado en la carpeta clean_data/output
            output_filename = json_filename.replace("_processed.json", "_cleaned.json")
            output_file = os.path.join("output", output_filename)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(cleaned_doc, f, ensure_ascii=False, indent=2)
                
            print(f"✅ Documento limpio guardado en: {output_file}")
            print(f"   📊 Chunks creados: {len(cleaned_doc['rag_chunks'])}")
            print(f"   📄 Elementos originales: {cleaned_doc['metadata']['processing_stats']['original_spans']}")
            print(f"   🔍 Elementos filtrados: {cleaned_doc['metadata']['processing_stats']['filtered_spans']}")
            
        except Exception as e:
            print(f"❌ Error procesando {json_filename}: {e}")
    
    print(f"\n🎉 Procesamiento completado. Archivos limpios en clean_data/output/")

if __name__ == "__main__":
    main()
