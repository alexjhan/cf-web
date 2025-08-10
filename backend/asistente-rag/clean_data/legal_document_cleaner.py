"""
Limpiador Especializado para Documentos Legales
Estrategia basada en la estructura jerárquica específica de documentos jurídicos
"""

import json
import re
from typing import List, Dict, Any, Optional

class LegalDocumentCleaner:
    """
    Limpiador especializado que respeta la estructura jerárquica de documentos legales:
    - Artículos como unidad base (Artículo X° + título + contenido)
    - Capítulos como agrupadores superiores
    - Títulos como divisores principales
    """
    
    def __init__(self):
        # Patrones específicos para documentos legales
        self.article_pattern = re.compile(r'^Artículo\s+\d+[°º]\s*', re.IGNORECASE)  # Removido $ para permitir títulos
        self.chapter_pattern = re.compile(r'^(CAPÍTULO|Capítulo)\s+[IVX\d]+', re.IGNORECASE)
        self.title_pattern = re.compile(r'^(TÍTULO|Título)\s+[IVX\d]+', re.IGNORECASE)
        
        # Configuración específica para fuentes y formatos
        self.article_font = "Arial-BoldMT"  # Artículos en negritas
        self.content_font = "ArialMT"       # Contenido normal
        
    def clean_document(self, json_file_path: str) -> Dict[str, Any]:
        """Limpia un documento legal respetando su estructura jerárquica"""
        
        with open(json_file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        # Filtrar elementos vacíos y muy pequeños
        content_items = [item for item in raw_data['content'] 
                        if item['text'].strip() and len(item['text'].strip()) > 1]
        
        print(f"📄 Procesando: {raw_data['file']}")
        print(f"📊 Elementos originales: {len(raw_data['content'])}")
        print(f"📊 Elementos filtrados: {len(content_items)}")
        
        # Agrupar artículos usando la estructura específica
        articles = self._extract_articles(content_items)
        
        print(f"📊 Artículos detectados: {len(articles)}")
        
        # Crear chunks finales optimizados para RAG
        final_chunks = self._create_rag_chunks(articles)
        
        return {
            "source_file": raw_data['file'],
            "total_chunks": len(final_chunks),
            "chunks": final_chunks,
            "metadata": {
                "original_spans": len(raw_data['content']),
                "filtered_spans": len(content_items),
                "extracted_articles": len(articles),
                "final_chunks": len(final_chunks),
                "processing_method": "legal_document_cleaner_v1"
            }
        }
    
    def _extract_articles(self, content_items: List[Dict]) -> List[Dict]:
        """Extrae artículos completos respetando la estructura jerárquica"""
        
        articles = []
        current_article = None
        current_context = {
            "chapter": "",
            "title": "",
            "section": ""
        }
        
        i = 0
        while i < len(content_items):
            item = content_items[i]
            text = item['text'].strip()
            font = item.get('font', '')
            size = item.get('size', 0)
            
            # Actualizar contexto jerárquico - mejorado para detectar títulos
            if self._is_title_start(text, font, size):
                # Capturar título completo que puede estar en múltiples líneas
                title_text = text
                j = i + 1
                # Buscar la línea siguiente para completar el título
                while j < len(content_items) and j < i + 3:  # Máximo 3 líneas para el título
                    next_item = content_items[j]
                    next_text = next_item['text'].strip()
                    next_font = next_item.get('font', '')
                    next_size = next_item.get('size', 0)
                    
                    # Si la siguiente línea es parte del título (mismo formato)
                    if (next_font == font and abs(next_size - size) < 1 and 
                        not self._is_chapter(next_text) and 
                        not self._is_article_start(next_text, next_font)):
                        title_text += " " + next_text
                        j += 1
                    else:
                        break
                
                current_context['title'] = title_text
                current_context['chapter'] = ""
                current_context['section'] = ""
                i = j - 1  # Ajustar índice para continuar después del título completo
                
            elif self._is_chapter(text):
                current_context['chapter'] = text
                current_context['section'] = ""
            elif self._is_section_header(text, item):
                current_context['section'] = text
            
            # Detectar inicio de artículo
            if self._is_article_start(text, font):
                # Guardar artículo anterior si existe
                if current_article:
                    articles.append(current_article)
                
                # Nuevo artículo
                current_article = {
                    "article_number": text,
                    "article_title": "",
                    "content": "",
                    "full_text": text,
                    "context": current_context.copy(),
                    "word_count": 0,
                    "spans": [item]
                }
                
                # Buscar título del artículo (primera línea después del número)
                if i + 1 < len(content_items):
                    next_item = content_items[i + 1]
                    next_text = next_item['text'].strip()
                    
                    # Si la siguiente línea no es otro artículo, es probablemente el título/contenido
                    if not self._is_article_start(next_text, next_item.get('font', '')):
                        # Determinar si es título (primera línea significativa)
                        if len(next_text) < 200 and not next_text.endswith('.'):
                            current_article['article_title'] = next_text
                            current_article['full_text'] += " " + next_text
                            current_article['spans'].append(next_item)
                            i += 1  # Saltar esta línea en la próxima iteración
                
            elif current_article and not self._is_article_start(text, font):
                # Agregar contenido al artículo actual
                if current_article['content']:
                    current_article['content'] += " " + text
                else:
                    current_article['content'] = text
                
                current_article['full_text'] += " " + text
                current_article['spans'].append(item)
                current_article['word_count'] = len(current_article['full_text'].split())
            
            i += 1
        
        # Agregar último artículo
        if current_article:
            articles.append(current_article)
        
        return articles
    
    def _is_article_start(self, text: str, font: str) -> bool:
        """Detecta si es el inicio de un artículo basándose en patrón y formato"""
        return (
            self.article_pattern.match(text) and 
            font == self.article_font
        )
    
    def _is_chapter(self, text: str) -> bool:
        """Detecta capítulos"""
        return bool(self.chapter_pattern.match(text))
    
    def _is_title(self, text: str) -> bool:
        """Detecta títulos"""
        return bool(self.title_pattern.match(text))
    
    def _is_title_start(self, text: str, font: str, size: float) -> bool:
        """Detecta inicio de título basándose en patrón, formato y tamaño"""
        return (
            self.title_pattern.match(text) and 
            font == "Arial-BoldMT" and 
            size > 13  # Los títulos tienen tamaño ~14.04
        )
    
    def _is_section_header(self, text: str, item: Dict) -> bool:
        """Detecta encabezados de sección"""
        return (
            len(text) < 200 and 
            text.isupper() and
            item.get('size', 0) > 12
        )
    
    def _create_rag_chunks(self, articles: List[Dict]) -> List[Dict]:
        """Crea chunks optimizados para RAG manteniendo artículos completos"""
        
        chunks = []
        
        for article in articles:
            # Crear chunk por artículo completo
            chunk = {
                "content": article['full_text'],
                "article_number": article['article_number'],
                "article_title": article['article_title'],
                "article_content": article['content'],
                "context": article['context'],
                "word_count": article['word_count'],
                "type": "article",
                "metadata": {
                    "chapter": article['context']['chapter'],
                    "title": article['context']['title'],
                    "section": article['context']['section'],
                    "spans_count": len(article['spans'])
                }
            }
            
            # Si el artículo es muy largo (>800 palabras), considerar dividirlo
            if article['word_count'] > 800:
                # Mantener como un solo chunk pero marcar para revisión
                chunk['metadata']['requires_review'] = True
                chunk['metadata']['reason'] = 'long_article'
            
            chunks.append(chunk)
        
        return chunks
    
    def preview_articles(self, json_file_path: str, limit: int = 5) -> None:
        """Vista previa de los primeros artículos detectados"""
        
        with open(json_file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        content_items = [item for item in raw_data['content'] 
                        if item['text'].strip() and len(item['text'].strip()) > 1]
        
        articles = self._extract_articles(content_items)
        
        print(f"\n🔍 VISTA PREVIA - Primeros {min(limit, len(articles))} artículos:")
        print("=" * 80)
        
        for i, article in enumerate(articles[:limit]):
            print(f"\n📄 ARTÍCULO {i+1}:")
            print(f"   Número: {article['article_number']}")
            print(f"   Título: {article['article_title']}")
            print(f"   Contexto: {article['context']['chapter']}")
            print(f"   Palabras: {article['word_count']}")
            print(f"   Contenido: {article['content'][:150]}...")
            print("-" * 40)

def main():
    """Procesar documentos legales con el nuevo limpiador especializado"""
    import os
    
    cleaner = LegalDocumentCleaner()
    
    # Crear carpeta de salida
    os.makedirs("output", exist_ok=True)
    
    # Procesar documentos
    input_folder = "../data_ingest/output"
    processed_files = [f for f in os.listdir(input_folder) if f.endswith("_processed.json")]
    
    for json_filename in processed_files:
        json_file = os.path.join(input_folder, json_filename)
        print(f"\n🔄 Procesando con nueva estrategia: {json_filename}")
        
        try:
            # Vista previa primero
            print("\n📋 VISTA PREVIA:")
            cleaner.preview_articles(json_file, limit=3)
            
            # Procesamiento completo
            print("\n⚙️ PROCESAMIENTO COMPLETO:")
            cleaned_doc = cleaner.clean_document(json_file)
            
            # Guardar resultado
            output_filename = json_filename.replace("_processed.json", "_legal_cleaned.json")
            output_file = os.path.join("output", output_filename)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(cleaned_doc, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Guardado: {output_file}")
            print(f"   📊 Artículos: {cleaned_doc['metadata']['extracted_articles']}")
            print(f"   📊 Chunks finales: {cleaned_doc['total_chunks']}")
            
            # Buscar y mostrar el Artículo 97° específicamente
            if "Estatuto" in json_filename:
                print(f"\n🎯 Verificando Artículo 97°...")
                for i, chunk in enumerate(cleaned_doc['chunks']):
                    if 'Artículo 97°' in chunk['content']:
                        print(f"✅ Encontrado en chunk {i+1}:")
                        print(f"   Número: {chunk['article_number']}")
                        print(f"   Título: {chunk['article_title']}")
                        print(f"   Contenido completo: {chunk['article_content']}")
                        print(f"   Palabras: {chunk['word_count']}")
                        break
                        
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n🎉 ¡Procesamiento con estrategia legal completado!")

if __name__ == "__main__":
    main()
