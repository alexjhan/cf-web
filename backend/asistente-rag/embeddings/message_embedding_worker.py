"""
Worker para procesar mensajes guardados y generar embeddings para el RAG
Convierte mensajes de data_ingest/messages/*.jsonl en fragments con embeddings
"""
import os
import json
import time
from datetime import datetime, timedelta
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer
import schedule
import logging

# Configuración
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MESSAGES_DIR = os.path.join(BASE_DIR, "data_ingest", "messages")
FRAGMENTS_DIR = os.path.join(BASE_DIR, "fragments")
EMBEDDINGS_PATH = os.path.join(FRAGMENTS_DIR, "fragments_embedded.json")
MODEL_NAME = "all-MiniLM-L6-v2"

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MessageEmbeddingWorker:
    def __init__(self):
        os.makedirs(MESSAGES_DIR, exist_ok=True)
        os.makedirs(FRAGMENTS_DIR, exist_ok=True)
        
        logger.info(f"Cargando modelo de embeddings: {MODEL_NAME}")
        self.model = SentenceTransformer(MODEL_NAME)
        
        # Cargar fragments existentes
        self.load_existing_fragments()
        
    def load_existing_fragments(self):
        """Carga fragments existentes o inicia lista vacía"""
        try:
            with open(EMBEDDINGS_PATH, "r", encoding="utf-8") as f:
                self.fragments = json.load(f)
            logger.info(f"Cargados {len(self.fragments)} fragments existentes")
        except FileNotFoundError:
            self.fragments = []
            logger.info("No hay fragments existentes, iniciando lista vacía")
    
    def clean_message_text(self, text: str) -> str:
        """Limpia y normaliza texto de mensajes"""
        # Eliminar URLs
        import re
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Eliminar menciones @usuario (WhatsApp)
        text = re.sub(r'@\d+', '', text)
        
        # Normalizar espacios
        text = ' '.join(text.split())
        
        # Filtrar mensajes muy cortos o ruido
        if len(text.strip()) < 10:
            return None
            
        # Filtrar spam/ruido común
        spam_indicators = ['jajaja', 'xD', 'jeje', 'jsjs', '😂', '🤣']
        if any(indicator in text.lower() for indicator in spam_indicators) and len(text) < 30:
            return None
            
        return text.strip()
    
    def is_academic_content(self, text: str, meta: Dict) -> bool:
        """Determina si el contenido es académicamente relevante"""
        academic_keywords = [
            # Materias específicas de Metalurgia
            'metalurgia', 'fundicion', 'aleaciones', 'tratamientos termicos', 'corrosion',
            'cristalografia', 'materiales', 'solidificacion', 'transformaciones de fase',
            'propiedades mecanicas', 'ensayos', 'dureza', 'resistencia',
            
            # Cursos básicos
            'calculo', 'fisica', 'quimica', 'matematica', 'estadistica', 'termodinamica',
            'mecanica', 'electricidad', 'magnetismo', 'ondas',
            
            # Académico general
            'examen', 'parcial', 'final', 'tarea', 'laboratorio', 'practica', 'proyecto',
            'syllabus', 'nota', 'calificacion', 'profesor', 'docente', 'clase', 'horario',
            'aula', 'salon', 'biblioteca', 'universidad', 'facultad', 'carrera',
            
            # Trámites administrativos
            'matricula', 'certificado', 'constancia', 'tramite', 'secretaria', 'decanato',
            'rectoria', 'titulo', 'grado', 'tesis', 'expediente', 'documentos',
            
            # Oportunidades
            'beca', 'intercambio', 'practica profesional', 'trabajo', 'convenio',
            'congreso', 'seminario', 'charla', 'conferencia', 'capacitacion'
        ]
        
        text_lower = text.lower()
        
        # Verificar palabras clave académicas
        keyword_score = sum(1 for keyword in academic_keywords if keyword in text_lower)
        
        # Verificar longitud (contenido sustancial)
        length_score = 1 if len(text) > 50 else 0
        
        # Verificar si es pregunta (educativo)
        question_score = 1 if any(q in text_lower for q in ['¿', '?', 'como', 'donde', 'cuando', 'que hacer', 'ayuda']) else 0
        
        # Scoring combinado
        total_score = keyword_score + length_score + question_score
        
        return total_score >= 2  # Umbral ajustable
    
    def process_new_messages(self):
        """Procesa mensajes nuevos desde archivos JSONL"""
        logger.info("Procesando mensajes nuevos...")
        
        new_fragments = []
        processed_count = 0
        
        # Procesar cada archivo de plataforma
        for platform_file in os.listdir(MESSAGES_DIR):
            if not platform_file.endswith('.jsonl'):
                continue
                
            file_path = os.path.join(MESSAGES_DIR, platform_file)
            platform = platform_file.replace('.jsonl', '')
            
            logger.info(f"Procesando {platform_file}...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    try:
                        message = json.loads(line.strip())
                        
                        # Verificar si ya fue procesado
                        message_id = f"{platform}_{message.get('ts', time.time())}_{line_num}"
                        if any(frag.get('source_id') == message_id for frag in self.fragments):
                            continue
                        
                        # Limpiar texto
                        clean_text = self.clean_message_text(message['text'])
                        if not clean_text:
                            continue
                        
                        # Verificar relevancia académica
                        if not self.is_academic_content(clean_text, message.get('meta', {})):
                            continue
                        
                        # Crear fragment
                        fragment = {
                            'source_id': message_id,
                            'texto': clean_text,
                            'fuente': f"{platform}_{message.get('author', 'unknown')}",
                            'timestamp': message.get('ts', time.time()),
                            'platform': platform,
                            'meta': message.get('meta', {}),
                            'processed_at': time.time()
                        }
                        
                        new_fragments.append(fragment)
                        processed_count += 1
                        
                    except json.JSONDecodeError:
                        logger.warning(f"Error parsing line {line_num} in {platform_file}")
                        continue
                    except Exception as e:
                        logger.error(f"Error processing message in {platform_file}:{line_num}: {e}")
                        continue
        
        if new_fragments:
            logger.info(f"Generando embeddings para {len(new_fragments)} mensajes nuevos...")
            self.generate_embeddings(new_fragments)
            logger.info(f"✅ Procesados {processed_count} mensajes académicos")
        else:
            logger.info("No hay mensajes nuevos para procesar")
    
    def generate_embeddings(self, new_fragments: List[Dict]):
        """Genera embeddings para fragments nuevos"""
        texts = [frag['texto'] for frag in new_fragments]
        
        # Generar embeddings en batch
        embeddings = self.model.encode(texts)
        
        # Agregar embeddings a fragments
        for fragment, embedding in zip(new_fragments, embeddings):
            fragment['embedding'] = embedding.tolist()
        
        # Combinar con fragments existentes
        self.fragments.extend(new_fragments)
        
        # Guardar archivo actualizado
        self.save_fragments()
    
    def save_fragments(self):
        """Guarda fragments con embeddings a disco"""
        with open(EMBEDDINGS_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.fragments, f, ensure_ascii=False, indent=2)
        
        logger.info(f"💾 Guardados {len(self.fragments)} fragments total")
    
    def cleanup_old_messages(self, days_to_keep=30):
        """Limpia mensajes antiguos para evitar acumulación excesiva"""
        cutoff_time = time.time() - (days_to_keep * 24 * 60 * 60)
        
        original_count = len(self.fragments)
        self.fragments = [
            frag for frag in self.fragments 
            if frag.get('timestamp', time.time()) > cutoff_time
        ]
        
        removed_count = original_count - len(self.fragments)
        if removed_count > 0:
            logger.info(f"🧹 Eliminados {removed_count} fragments antiguos (>{days_to_keep} días)")
            self.save_fragments()
    
    def run_processing_cycle(self):
        """Ejecuta un ciclo completo de procesamiento"""
        logger.info("=== Iniciando ciclo de procesamiento ===")
        try:
            self.process_new_messages()
            self.cleanup_old_messages()
            logger.info("=== Ciclo completado exitosamente ===")
        except Exception as e:
            logger.error(f"Error en ciclo de procesamiento: {e}")

def main():
    logger.info("🚀 Iniciando Worker de Embeddings para RAG Metalurgia")
    
    worker = MessageEmbeddingWorker()
    
    # Procesar mensajes existentes al inicio
    worker.run_processing_cycle()
    
    # Programar ejecuciones periódicas
    schedule.every(5).minutes.do(worker.run_processing_cycle)
    schedule.every().day.at("02:00").do(lambda: worker.cleanup_old_messages())
    
    logger.info("⏰ Worker programado: cada 5 min procesamiento, limpieza diaria 2 AM")
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(30)  # Check cada 30 segundos
    except KeyboardInterrupt:
        logger.info("🛑 Worker detenido por usuario")

if __name__ == "__main__":
    main()
