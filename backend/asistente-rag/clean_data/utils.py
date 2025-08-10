"""
Utilidades para la limpieza de documentos
"""

import re
from typing import Dict, List, Any

class DocumentUtils:
    
    def __init__(self):
        # Patrones para identificar estructura
        self.article_pattern = re.compile(r'^(Artículo|Art\.?)\s*\d+[°º]?\s*[.-]?', re.IGNORECASE)
        self.chapter_pattern = re.compile(r'^(Capítulo|Cap\.?)\s*[IVX\d]+', re.IGNORECASE)
        self.title_pattern = re.compile(r'^(TÍTULO|Título)\s*[IVX\d]+', re.IGNORECASE)
        self.section_pattern = re.compile(r'^(Sección|Sec\.?)\s*[IVX\d]+', re.IGNORECASE)
        
    def is_sentence_end(self, text: str) -> bool:
        """Detecta si el texto termina una oración"""
        text = text.strip()
        return text.endswith('.') or text.endswith('!') or text.endswith('?')
    
    def is_title_or_header(self, item: Dict) -> bool:
        """Detecta si el elemento es un título o encabezado"""
        text = item['text'].strip()
        
        # Verificar si está en mayúsculas (indica título)
        if len(text) > 3 and text.isupper():
            return True
            
        # Verificar tamaño de fuente grande
        if item.get('size', 0) > 16:
            return True
            
        # Verificar si es negrita y relativamente corto
        if item.get('bold', False) and len(text.split()) <= 10:
            return True
            
        # Verificar patrones específicos
        if (self.chapter_pattern.match(text) or 
            self.title_pattern.match(text) or 
            self.section_pattern.match(text)):
            return True
            
        return False
    
    def is_article_number(self, text: str) -> bool:
        """Detecta si el texto es un número de artículo"""
        return bool(self.article_pattern.match(text.strip()))
    
    def format_changed_significantly(self, item1: Dict, item2: Dict) -> bool:
        """Detecta cambios significativos de formato entre elementos"""
        # Cambio significativo en tamaño de fuente
        size_diff = abs(item1.get('size', 0) - item2.get('size', 0))
        if size_diff > 3:
            return True
            
        # Cambio en negrita
        if item1.get('bold', False) != item2.get('bold', False):
            return True
            
        # Cambio en fuente
        if item1.get('font', '') != item2.get('font', ''):
            return True
            
        return False
    
    def get_dominant_format(self, spans: List[Dict]) -> Dict:
        """Obtiene el formato dominante de una lista de spans"""
        if not spans:
            return {}
            
        # Calcular estadísticas
        sizes = [span.get('size', 0) for span in spans]
        fonts = [span.get('font', '') for span in spans]
        bold_count = sum(1 for span in spans if span.get('bold', False))
        italic_count = sum(1 for span in spans if span.get('italic', False))
        
        # Formato dominante
        dominant_size = max(set(sizes), key=sizes.count) if sizes else 0
        dominant_font = max(set(fonts), key=fonts.count) if fonts else ''
        
        return {
            "size": dominant_size,
            "font": dominant_font,
            "bold": bold_count > len(spans) / 2,
            "italic": italic_count > len(spans) / 2,
            "span_count": len(spans)
        }
    
    def classify_content_type(self, text: str, format_info: Dict) -> str:
        """Clasifica el tipo de contenido basado en texto y formato"""
        text_clean = text.strip()
        
        # Títulos principales
        if (len(text_clean) < 100 and 
            (text_clean.isupper() or 
             format_info.get('size', 0) > 18 or
             self.title_pattern.match(text_clean))):
            return 'title'
        
        # Capítulos
        if self.chapter_pattern.match(text_clean):
            return 'chapter'
            
        # Secciones
        if self.section_pattern.match(text_clean):
            return 'section'
        
        # Subtítulos
        if (len(text_clean) < 200 and 
            (format_info.get('bold', False) or 
             format_info.get('size', 0) > 14)):
            return 'subtitle'
        
        # Artículos
        if self.article_pattern.match(text_clean):
            return 'article'
        
        # Elementos de lista
        if (text_clean.startswith(('•', '-', '*', '·')) or
            re.match(r'^\d+[.)]\s+', text_clean) or
            re.match(r'^[a-z][.)]\s+', text_clean)):
            return 'list_item'
        
        # Contenido normal
        return 'content'
    
    def calculate_importance_score(self, text: str, format_info: Dict, content_type: str) -> float:
        """Calcula un score de importancia para el contenido"""
        score = 1.0
        
        # Bonus por tipo de contenido
        type_scores = {
            'title': 5.0,
            'chapter': 4.0,
            'section': 3.5,
            'subtitle': 3.0,
            'article': 3.5,
            'list_item': 2.0,
            'content': 1.0
        }
        score *= type_scores.get(content_type, 1.0)
        
        # Bonus por formato
        if format_info.get('bold', False):
            score *= 1.5
        if format_info.get('size', 0) > 14:
            score *= 1.2
        if format_info.get('size', 0) > 18:
            score *= 1.5
            
        # Bonus por palabras clave importantes
        important_keywords = [
            'artículo', 'capítulo', 'título', 'sección',
            'obligatorio', 'requisito', 'derecho', 'deber',
            'universidad', 'estudiante', 'docente', 'investigación'
        ]
        
        text_lower = text.lower()
        keyword_count = sum(1 for keyword in important_keywords if keyword in text_lower)
        if keyword_count > 0:
            score *= (1.0 + keyword_count * 0.1)
        
        return min(score, 10.0)  # Máximo score de 10
    
    def clean_text(self, text: str) -> str:
        """Limpia el texto eliminando caracteres extraños"""
        # Eliminar múltiples espacios
        text = re.sub(r'\s+', ' ', text)
        
        # Eliminar caracteres de control
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]', '', text)
        
        # Normalizar comillas
        text = text.replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'")
        
        return text.strip()
    
    def should_merge_with_previous(self, current_text: str, previous_text: str, 
                                  current_format: Dict, previous_format: Dict) -> bool:
        """Determina si el texto actual debe fusionarse con el anterior"""
        
        # Si el texto anterior no termina con puntuación y el actual continúa
        if (not self.is_sentence_end(previous_text) and 
            not self.is_title_or_header({'text': current_text, **current_format}) and
            not self.is_article_number(current_text)):
            return True
            
        # Si ambos tienen formato similar y el anterior es muy corto
        if (len(previous_text.split()) < 5 and
            abs(current_format.get('size', 0) - previous_format.get('size', 0)) < 2):
            return True
            
        return False
