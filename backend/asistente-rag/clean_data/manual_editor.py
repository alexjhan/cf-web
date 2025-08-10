"""
Editor Manual de Documentos Legales
Herramienta interactiva para limpieza manual de documentos
"""

import json
import os
from typing import List, Dict, Any

class ManualDocumentEditor:
    """
    Editor manual que permite revisar y editar chunks de documentos
    de manera interactiva para asegurar la calidad de los datos para RAG
    """
    
    def __init__(self):
        self.current_document = None
        self.chunks = []
        self.current_index = 0
        
    def load_document(self, file_path: str):
        """Cargar documento para edición manual"""
        with open(file_path, 'r', encoding='utf-8') as f:
            self.current_document = json.load(f)
        
        self.chunks = self.current_document.get('chunks', [])
        self.current_index = 0
        
        print(f"📄 Documento cargado: {self.current_document.get('source_file', 'Desconocido')}")
        print(f"📊 Total de chunks: {len(self.chunks)}")
        
    def show_chunk(self, index: int = None):
        """Mostrar chunk actual para revisión"""
        if index is not None:
            self.current_index = index
            
        if not self.chunks or self.current_index >= len(self.chunks):
            print("❌ No hay chunks disponibles o índice fuera de rango")
            return
            
        chunk = self.chunks[self.current_index]
        
        print("\n" + "="*80)
        print(f"📝 CHUNK {self.current_index + 1} de {len(self.chunks)}")
        print("="*80)
        
        if 'article_number' in chunk:
            print(f"🔢 Número: {chunk['article_number']}")
            print(f"📋 Título: {chunk.get('article_title', 'Sin título')}")
            print(f"📄 Contexto: {chunk.get('context', {}).get('chapter', 'Sin contexto')}")
            print(f"📊 Palabras: {chunk.get('word_count', 0)}")
            print(f"📝 Tipo: {chunk.get('type', 'Desconocido')}")
        
        print("\n🔍 CONTENIDO:")
        print("-" * 40)
        content = chunk.get('content', '')
        print(content)
        print("-" * 40)
        
    def edit_chunk(self):
        """Editar el chunk actual"""
        if not self.chunks or self.current_index >= len(self.chunks):
            print("❌ No hay chunk para editar")
            return
            
        chunk = self.chunks[self.current_index]
        
        print("\n✏️ MODO EDICIÓN")
        print("Deja vacío para mantener el valor actual")
        print("Escribe 'SKIP' para saltar este campo")
        
        # Editar número de artículo
        if 'article_number' in chunk:
            current_number = chunk.get('article_number', '')
            new_number = input(f"Número [{current_number}]: ").strip()
            if new_number and new_number != 'SKIP':
                chunk['article_number'] = new_number
        
        # Editar título
        if 'article_title' in chunk:
            current_title = chunk.get('article_title', '')
            print(f"\nTítulo actual: {current_title}")
            new_title = input("Nuevo título (o ENTER para mantener): ").strip()
            if new_title and new_title != 'SKIP':
                chunk['article_title'] = new_title
        
        # Editar contenido
        current_content = chunk.get('content', '')
        print(f"\nContenido actual:")
        print(current_content[:200] + "..." if len(current_content) > 200 else current_content)
        
        edit_content = input("\n¿Editar contenido? (s/n): ").strip().lower()
        if edit_content == 's':
            print("\nIngresa el nuevo contenido (presiona ENTER dos veces para terminar):")
            lines = []
            while True:
                line = input()
                if line == "" and len(lines) > 0 and lines[-1] == "":
                    break
                lines.append(line)
            
            new_content = "\n".join(lines[:-1])  # Remover última línea vacía
            if new_content.strip():
                chunk['content'] = new_content
                # Actualizar word count
                chunk['word_count'] = len(new_content.split())
        
        print("✅ Chunk editado")
    
    def delete_chunk(self):
        """Eliminar chunk actual"""
        if not self.chunks or self.current_index >= len(self.chunks):
            print("❌ No hay chunk para eliminar")
            return
            
        confirm = input(f"¿Eliminar chunk {self.current_index + 1}? (s/n): ").strip().lower()
        if confirm == 's':
            del self.chunks[self.current_index]
            if self.current_index >= len(self.chunks) and self.chunks:
                self.current_index = len(self.chunks) - 1
            print("✅ Chunk eliminado")
        
    def merge_with_next(self):
        """Fusionar con el siguiente chunk"""
        if self.current_index >= len(self.chunks) - 1:
            print("❌ No hay siguiente chunk para fusionar")
            return
            
        current_chunk = self.chunks[self.current_index]
        next_chunk = self.chunks[self.current_index + 1]
        
        print(f"\n🔗 FUSIONAR CHUNKS {self.current_index + 1} y {self.current_index + 2}")
        print("Chunk actual:")
        print(current_chunk.get('content', '')[:150] + "...")
        print("\nSiguiente chunk:")
        print(next_chunk.get('content', '')[:150] + "...")
        
        confirm = input("\n¿Fusionar? (s/n): ").strip().lower()
        if confirm == 's':
            # Combinar contenido
            current_chunk['content'] += " " + next_chunk.get('content', '')
            current_chunk['word_count'] = len(current_chunk['content'].split())
            
            # Eliminar el siguiente chunk
            del self.chunks[self.current_index + 1]
            print("✅ Chunks fusionados")
    
    def split_chunk(self):
        """Dividir chunk actual"""
        if not self.chunks or self.current_index >= len(self.chunks):
            print("❌ No hay chunk para dividir")
            return
            
        chunk = self.chunks[self.current_index]
        content = chunk.get('content', '')
        
        print(f"\n✂️ DIVIDIR CHUNK {self.current_index + 1}")
        print("Contenido actual:")
        print(content)
        
        split_position = input("\nIngresa la palabra donde dividir (o posición numérica): ").strip()
        
        try:
            # Intentar como posición numérica
            position = int(split_position)
            if 0 < position < len(content):
                first_part = content[:position].strip()
                second_part = content[position:].strip()
            else:
                print("❌ Posición inválida")
                return
        except ValueError:
            # Buscar la palabra
            if split_position in content:
                split_index = content.find(split_position)
                first_part = content[:split_index].strip()
                second_part = content[split_index:].strip()
            else:
                print("❌ Palabra no encontrada")
                return
        
        if first_part and second_part:
            # Actualizar chunk actual
            chunk['content'] = first_part
            chunk['word_count'] = len(first_part.split())
            
            # Crear nuevo chunk
            new_chunk = chunk.copy()
            new_chunk['content'] = second_part
            new_chunk['word_count'] = len(second_part.split())
            
            # Insertar después del actual
            self.chunks.insert(self.current_index + 1, new_chunk)
            print("✅ Chunk dividido")
        else:
            print("❌ No se pudo dividir correctamente")
    
    def navigate(self):
        """Navegación entre chunks"""
        while True:
            print(f"\n📍 Chunk {self.current_index + 1} de {len(self.chunks)}")
            command = input("Comando [n]ext [p]rev [e]dit [d]elete [m]erge [s]plit [g]oto [q]uit: ").strip().lower()
            
            if command == 'n' or command == 'next':
                if self.current_index < len(self.chunks) - 1:
                    self.current_index += 1
                    self.show_chunk()
                else:
                    print("❌ Ya estás en el último chunk")
                    
            elif command == 'p' or command == 'prev':
                if self.current_index > 0:
                    self.current_index -= 1
                    self.show_chunk()
                else:
                    print("❌ Ya estás en el primer chunk")
                    
            elif command == 'e' or command == 'edit':
                self.edit_chunk()
                self.show_chunk()
                
            elif command == 'd' or command == 'delete':
                self.delete_chunk()
                if self.chunks:
                    self.show_chunk()
                    
            elif command == 'm' or command == 'merge':
                self.merge_with_next()
                if self.chunks:
                    self.show_chunk()
                    
            elif command == 's' or command == 'split':
                self.split_chunk()
                if self.chunks:
                    self.show_chunk()
                    
            elif command == 'g' or command == 'goto':
                try:
                    goto_index = int(input("Ir al chunk #: ")) - 1
                    if 0 <= goto_index < len(self.chunks):
                        self.current_index = goto_index
                        self.show_chunk()
                    else:
                        print("❌ Número de chunk inválido")
                except ValueError:
                    print("❌ Ingresa un número válido")
                    
            elif command == 'q' or command == 'quit':
                break
                
            else:
                print("❌ Comando no reconocido")
    
    def save_document(self, output_path: str = None):
        """Guardar documento editado"""
        if not output_path:
            original_name = self.current_document.get('source_file', 'documento')
            output_path = f"output/{os.path.basename(original_name)}_manual_edited.json"
        
        # Actualizar metadatos
        self.current_document['total_chunks'] = len(self.chunks)
        self.current_document['chunks'] = self.chunks
        self.current_document['metadata']['final_chunks'] = len(self.chunks)
        self.current_document['metadata']['processing_method'] = 'manual_editing'
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.current_document, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Documento guardado: {output_path}")
        print(f"📊 Total de chunks finales: {len(self.chunks)}")

def main():
    """Función principal para edición manual"""
    editor = ManualDocumentEditor()
    
    print("🔧 EDITOR MANUAL DE DOCUMENTOS LEGALES")
    print("=" * 50)
    
    # Listar archivos disponibles
    print("📁 Archivos disponibles para editar:")
    available_files = []
    for file in os.listdir("output"):
        if file.endswith("_legal_cleaned.json"):
            available_files.append(file)
            print(f"  {len(available_files)}. {file}")
    
    if not available_files:
        print("❌ No hay archivos disponibles para editar")
        return
    
    # Seleccionar archivo
    try:
        choice = int(input("\nSelecciona el archivo (número): ")) - 1
        if 0 <= choice < len(available_files):
            file_path = f"output/{available_files[choice]}"
            editor.load_document(file_path)
            
            # Mostrar primer chunk y comenzar navegación
            editor.show_chunk(0)
            editor.navigate()
            
            # Guardar cambios
            save_confirm = input("\n¿Guardar cambios? (s/n): ").strip().lower()
            if save_confirm == 's':
                editor.save_document()
            
        else:
            print("❌ Selección inválida")
    except (ValueError, KeyboardInterrupt):
        print("\n👋 Edición cancelada")

if __name__ == "__main__":
    main()
