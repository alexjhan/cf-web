"""
Extractor de texto plano para fragmentación manual
Convierte el JSON procesado a texto plano fácil de editar
"""

import json
import os

def extract_plain_text(json_file_path: str, output_file: str):
    """Extrae texto plano del JSON procesado"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extraer solo el texto, limpio
    plain_text = ""
    
    for item in data['content']:
        text = item['text'].strip()
        if text and len(text) > 2:
            # Agregar metadatos de formato como comentarios
            size = item.get('size', 0)
            bold = item.get('bold', False)
            
            # Marcar títulos y elementos importantes
            if size > 16 or bold or text.isupper():
                plain_text += f"\n\n### {text} ###"
                if bold:
                    plain_text += " [NEGRITA]"
                if size > 16:
                    plain_text += f" [TAMAÑO: {size:.1f}]"
                plain_text += "\n"
            else:
                plain_text += f" {text}"
    
    # Guardar texto plano
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(plain_text.strip())
    
    print(f"✅ Texto plano guardado en: {output_file}")
    print(f"📄 Puedes editarlo manualmente y dividirlo en secciones")

def create_manual_template(output_file: str):
    """Crea una plantilla para fragmentación manual"""
    
    template = """# PLANTILLA PARA FRAGMENTACIÓN MANUAL DEL ESTATUTO UNSAAC

## INSTRUCCIONES:
1. Divide el contenido en chunks lógicos (artículos, capítulos, secciones)
2. Cada chunk debe tener entre 200-800 palabras
3. Mantén los artículos completos
4. Usa este formato:

---CHUNK_START---
TÍTULO: [Título del chunk]
TIPO: [article/chapter/section/content]
CONTENIDO:
[Contenido del chunk aquí]
---CHUNK_END---

## EJEMPLO:
---CHUNK_START---
TÍTULO: Artículo 97° - Idioma Extranjero
TIPO: article
CONTENIDO:
Artículo 97° En los estudios de pregrado es obligatoria la enseñanza de un idioma extranjero, de preferencia inglés o una lengua nativa.
---CHUNK_END---

## CONTENIDO PARA FRAGMENTAR:
[Aquí irá el texto extraído]

"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(template)
    
    print(f"✅ Plantilla creada en: {output_file}")

def main():
    """Procesar documentos para fragmentación manual"""
    
    # Crear directorio de trabajo manual
    os.makedirs("manual_chunking", exist_ok=True)
    
    # Procesar el estatuto
    json_file = "../data_ingest/output/EstatutoUniversitario_UNSAAC_processed.json"
    
    if os.path.exists(json_file):
        print("🔄 Extrayendo texto plano del Estatuto...")
        
        # Extraer texto plano
        plain_text_file = "manual_chunking/estatuto_texto_plano.txt"
        extract_plain_text(json_file, plain_text_file)
        
        # Crear plantilla de trabajo
        template_file = "manual_chunking/estatuto_plantilla_manual.txt"
        create_manual_template(template_file)
        
        print("\n📋 PASOS SIGUIENTES:")
        print("1. Abre: manual_chunking/estatuto_texto_plano.txt")
        print("2. Copia el contenido relevante a: manual_chunking/estatuto_plantilla_manual.txt")
        print("3. Divide manualmente en chunks usando el formato indicado")
        print("4. Cuando termines, ejecuta convert_manual_chunks.py")
        
    else:
        print(f"❌ Archivo no encontrado: {json_file}")

if __name__ == "__main__":
    main()
