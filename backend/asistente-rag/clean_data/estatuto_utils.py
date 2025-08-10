#!/usr/bin/env python3
"""
Utilitarias para trabajar con el JSON optimizado del Estatuto UNSAAC
"""

import json

class EstatutoProcessor:
    """
    Clase para procesar y trabajar con el documento del Estatuto optimizado
    """
    
    def __init__(self, json_file_path):
        """
        Inicializar con el archivo JSON optimizado
        """
        self.json_file_path = json_file_path
        self.data = self.load_data()
    
    def load_data(self):
        """
        Cargar el archivo JSON
        """
        with open(self.json_file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def get_full_content(self, chunk):
        """
        Reconstruir el contenido completo de un artículo
        
        Args:
            chunk (dict): Chunk del artículo
            
        Returns:
            str: Contenido completo del artículo
        """
        article_number = chunk.get('article_number', '')
        article_title = chunk.get('article_title', '')
        article_content = chunk.get('article_content', '')
        
        # Construir contenido completo
        parts = [article_number]
        if article_title:
            parts.append(article_title)
        if article_content:
            parts.append(article_content)
            
        return ' '.join(parts)
    
    def search_articles(self, query, search_in=['article_number', 'article_title', 'article_content']):
        """
        Buscar artículos que contengan el término de búsqueda
        
        Args:
            query (str): Término de búsqueda
            search_in (list): Campos donde buscar
            
        Returns:
            list: Lista de artículos que coinciden
        """
        query_lower = query.lower()
        results = []
        
        for chunk in self.data['chunks']:
            for field in search_in:
                if field in chunk and query_lower in chunk[field].lower():
                    results.append(chunk)
                    break
        
        return results
    
    def get_articles_by_title(self, title):
        """
        Obtener artículos de un título específico
        
        Args:
            title (str): Título a buscar (ej: "TÍTULO I DISPOSICIONES GENERALES")
            
        Returns:
            list: Lista de artículos del título
        """
        results = []
        for chunk in self.data['chunks']:
            if chunk['context']['title'] == title:
                results.append(chunk)
        return results
    
    def get_articles_by_chapter(self, chapter):
        """
        Obtener artículos de un capítulo específico
        
        Args:
            chapter (str): Capítulo a buscar
            
        Returns:
            list: Lista de artículos del capítulo
        """
        results = []
        for chunk in self.data['chunks']:
            if chunk['context']['chapter'] == chapter:
                results.append(chunk)
        return results
    
    def get_statistics(self):
        """
        Obtener estadísticas del documento
        
        Returns:
            dict: Estadísticas del documento
        """
        titulos = set()
        capitulos = set()
        total_words = 0
        
        for chunk in self.data['chunks']:
            if chunk['context']['title']:
                titulos.add(chunk['context']['title'])
            if chunk['context']['chapter']:
                capitulos.add(chunk['context']['chapter'])
            total_words += chunk.get('word_count', 0)
        
        return {
            'total_chunks': self.data['total_chunks'],
            'total_titles': len(titulos),
            'total_chapters': len(capitulos),
            'total_words': total_words,
            'titles': sorted(list(titulos)),
            'chapters': sorted(list(capitulos))
        }
    
    def format_article_for_rag(self, chunk, include_context=True):
        """
        Formatear un artículo para su uso en sistema RAG
        
        Args:
            chunk (dict): Chunk del artículo
            include_context (bool): Incluir información de contexto
            
        Returns:
            str: Artículo formateado para RAG
        """
        content = self.get_full_content(chunk)
        
        if include_context:
            context_parts = []
            if chunk['context']['title']:
                context_parts.append(f"Título: {chunk['context']['title']}")
            if chunk['context']['chapter']:
                context_parts.append(f"Capítulo: {chunk['context']['chapter']}")
            if chunk['context']['section']:
                context_parts.append(f"Sección: {chunk['context']['section']}")
            
            if context_parts:
                context_str = " | ".join(context_parts)
                content = f"[{context_str}] {content}"
        
        return content

# Ejemplo de uso
if __name__ == "__main__":
    # Cargar el procesador
    processor = EstatutoProcessor("output/EstatutoUniversitario_UNSAAC_optimized.json")
    
    # Obtener estadísticas
    stats = processor.get_statistics()
    print("📊 ESTADÍSTICAS DEL DOCUMENTO:")
    print(f"   • Total de artículos: {stats['total_chunks']}")
    print(f"   • Total de títulos: {stats['total_titles']}")
    print(f"   • Total de capítulos: {stats['total_chapters']}")
    print(f"   • Total de palabras: {stats['total_words']:,}")
    
    print("\n📚 TÍTULOS ENCONTRADOS:")
    for i, title in enumerate(stats['titles'], 1):
        print(f"   {i}. {title}")
    
    # Ejemplo de búsqueda
    print("\n🔍 EJEMPLO DE BÚSQUEDA - 'autonomía':")
    results = processor.search_articles('autonomía')
    print(f"   Encontrados: {len(results)} artículos")
    
    # Ejemplo de artículo formateado para RAG
    if results:
        print(f"\n📄 EJEMPLO DE ARTÍCULO FORMATEADO PARA RAG:")
        formatted = processor.format_article_for_rag(results[0])
        print(f"   {formatted[:200]}...")
