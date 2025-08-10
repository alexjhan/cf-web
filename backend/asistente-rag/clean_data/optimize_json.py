#!/usr/bin/env python3
"""
Script para optimizar el JSON eliminando el campo 'content' redundante
ya que se puede reconstruir con article_number + article_title + article_content
"""

import json

def optimize_json_structure(input_file, output_file):
    """
    Optimiza la estructura del JSON eliminando redundancias
    """
    print(f"🔄 Cargando archivo: {input_file}")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"📊 Total de chunks originales: {data['total_chunks']}")
    
    # Optimizar cada chunk
    optimized_chunks = []
    for i, chunk in enumerate(data['chunks']):
        optimized_chunk = {
            "article_number": chunk["article_number"],
            "article_title": chunk["article_title"],
            "article_content": chunk["article_content"],
            "context": chunk["context"],
            "word_count": chunk["word_count"],
            "type": chunk["type"],
            "metadata": chunk["metadata"]
        }
        
        # Nota: Eliminamos el campo 'content' ya que es redundante
        # Se puede reconstruir como: article_number + " " + article_title + " " + article_content
        
        optimized_chunks.append(optimized_chunk)
    
    # Crear estructura optimizada
    optimized_data = {
        "source_file": data["source_file"],
        "total_chunks": data["total_chunks"],
        "processing_info": {
            "optimization": "Removed redundant 'content' field - can be reconstructed from article_number + article_title + article_content",
            "structure": "Optimized for RAG system usage"
        },
        "chunks": optimized_chunks
    }
    
    # Guardar archivo optimizado
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(optimized_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Archivo optimizado guardado: {output_file}")
    
    # Mostrar estadísticas de optimización
    original_size = len(json.dumps(data, ensure_ascii=False))
    optimized_size = len(json.dumps(optimized_data, ensure_ascii=False))
    reduction_percent = ((original_size - optimized_size) / original_size) * 100
    
    print(f"📈 Estadísticas de optimización:")
    print(f"   • Tamaño original: {original_size:,} caracteres")
    print(f"   • Tamaño optimizado: {optimized_size:,} caracteres")
    print(f"   • Reducción: {reduction_percent:.1f}%")
    
    # Mostrar ejemplo de estructura optimizada
    print(f"\n📋 Ejemplo de estructura optimizada:")
    print(f"   • article_number: '{optimized_chunks[0]['article_number']}'")
    print(f"   • article_title: '{optimized_chunks[0]['article_title'][:50]}...'")
    print(f"   • article_content: '{optimized_chunks[0]['article_content'][:50]}...'")
    print(f"   • context: {optimized_chunks[0]['context']}")
    
    return optimized_data

def reconstruct_full_content(chunk):
    """
    Función utilitaria para reconstruir el contenido completo cuando sea necesario
    """
    return f"{chunk['article_number']} {chunk['article_title']} {chunk['article_content']}"

if __name__ == "__main__":
    input_file = "output/EstatutoUniversitario_UNSAAC_legal_cleaned_with_titles.json"
    output_file = "output/EstatutoUniversitario_UNSAAC_optimized.json"
    
    optimize_json_structure(input_file, output_file)
    
    print(f"\n🎯 Para reconstruir el contenido completo, usa:")
    print(f"   full_content = chunk['article_number'] + ' ' + chunk['article_title'] + ' ' + chunk['article_content']")
