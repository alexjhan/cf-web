"""
Analizador de Chunks - Identifica chunks problemáticos que necesitan edición manual
"""

import json
import os
from typing import List, Dict, Any

class ChunkAnalyzer:
    """
    Analiza chunks para identificar problemas comunes que requieren edición manual
    """
    
    def __init__(self):
        self.issues_found = []
    
    def analyze_document(self, file_path: str) -> Dict[str, Any]:
        """Analizar documento y detectar problemas"""
        
        with open(file_path, 'r', encoding='utf-8') as f:
            document = json.load(f)
        
        chunks = document.get('chunks', [])
        self.issues_found = []
        
        print(f"🔍 ANÁLISIS DE CALIDAD: {os.path.basename(file_path)}")
        print("=" * 60)
        
        # Análisis de problemas
        self._check_missing_articles(chunks)
        self._check_merged_articles(chunks)
        self._check_incomplete_content(chunks)
        self._check_long_chunks(chunks)
        self._check_short_chunks(chunks)
        self._check_inconsistent_numbering(chunks)
        
        # Resumen
        self._show_summary(chunks)
        
        return {
            "total_chunks": len(chunks),
            "issues_found": len(self.issues_found),
            "issues": self.issues_found
        }
    
    def _check_missing_articles(self, chunks: List[Dict]):
        """Detectar posibles artículos faltantes por numeración"""
        article_numbers = []
        
        for i, chunk in enumerate(chunks):
            article_num = chunk.get('article_number', '')
            if 'Artículo' in article_num:
                try:
                    # Extraer número
                    num_str = article_num.replace('Artículo', '').replace('°', '').strip()
                    num = int(num_str)
                    article_numbers.append((num, i))
                except:
                    continue
        
        # Verificar secuencia
        article_numbers.sort()
        for i in range(1, len(article_numbers)):
            current_num, current_idx = article_numbers[i]
            prev_num, prev_idx = article_numbers[i-1]
            
            if current_num - prev_num > 1:
                missing_numbers = list(range(prev_num + 1, current_num))
                self.issues_found.append({
                    "type": "missing_articles",
                    "description": f"Posibles artículos faltantes: {missing_numbers}",
                    "chunk_index": current_idx,
                    "severity": "high"
                })
    
    def _check_merged_articles(self, chunks: List[Dict]):
        """Detectar chunks que contienen múltiples artículos"""
        for i, chunk in enumerate(chunks):
            content = chunk.get('content', '')
            article_count = content.count('Artículo')
            
            if article_count > 1:
                self.issues_found.append({
                    "type": "merged_articles",
                    "description": f"Chunk contiene {article_count} artículos",
                    "chunk_index": i,
                    "chunk_number": chunk.get('article_number', f'Chunk {i+1}'),
                    "severity": "high",
                    "preview": content[:150] + "..."
                })
    
    def _check_incomplete_content(self, chunks: List[Dict]):
        """Detectar chunks con contenido incompleto"""
        for i, chunk in enumerate(chunks):
            content = chunk.get('content', '')
            
            # Verificar si termina abruptamente
            if len(content) > 50 and not content.strip().endswith(('.', ':', ';')):
                self.issues_found.append({
                    "type": "incomplete_content",
                    "description": "Contenido posiblemente incompleto",
                    "chunk_index": i,
                    "chunk_number": chunk.get('article_number', f'Chunk {i+1}'),
                    "severity": "medium",
                    "preview": content[-100:] if len(content) > 100 else content
                })
    
    def _check_long_chunks(self, chunks: List[Dict]):
        """Detectar chunks excesivamente largos"""
        for i, chunk in enumerate(chunks):
            word_count = chunk.get('word_count', 0)
            
            if word_count > 800:
                self.issues_found.append({
                    "type": "long_chunk",
                    "description": f"Chunk muy largo ({word_count} palabras)",
                    "chunk_index": i,
                    "chunk_number": chunk.get('article_number', f'Chunk {i+1}'),
                    "severity": "medium",
                    "word_count": word_count
                })
    
    def _check_short_chunks(self, chunks: List[Dict]):
        """Detectar chunks excesivamente cortos"""
        for i, chunk in enumerate(chunks):
            word_count = chunk.get('word_count', 0)
            
            if word_count < 10:
                self.issues_found.append({
                    "type": "short_chunk",
                    "description": f"Chunk muy corto ({word_count} palabras)",
                    "chunk_index": i,
                    "chunk_number": chunk.get('article_number', f'Chunk {i+1}'),
                    "severity": "low",
                    "word_count": word_count,
                    "content": chunk.get('content', '')
                })
    
    def _check_inconsistent_numbering(self, chunks: List[Dict]):
        """Detectar numeración inconsistente"""
        for i, chunk in enumerate(chunks):
            article_num = chunk.get('article_number', '')
            content = chunk.get('content', '')
            
            # Verificar si el número en article_number coincide con el contenido
            if 'Artículo' in article_num and 'Artículo' in content:
                content_start = content[:50]
                if article_num.strip() not in content_start:
                    self.issues_found.append({
                        "type": "inconsistent_numbering",
                        "description": "Numeración inconsistente entre metadatos y contenido",
                        "chunk_index": i,
                        "chunk_number": article_num,
                        "severity": "medium",
                        "metadata_number": article_num,
                        "content_preview": content_start
                    })
    
    def _show_summary(self, chunks: List[Dict]):
        """Mostrar resumen del análisis"""
        
        # Contar por tipo de problema
        issue_types = {}
        severity_count = {"high": 0, "medium": 0, "low": 0}
        
        for issue in self.issues_found:
            issue_type = issue['type']
            severity = issue['severity']
            
            issue_types[issue_type] = issue_types.get(issue_type, 0) + 1
            severity_count[severity] += 1
        
        print(f"\n📊 RESUMEN DEL ANÁLISIS")
        print(f"Total de chunks: {len(chunks)}")
        print(f"Problemas encontrados: {len(self.issues_found)}")
        
        if severity_count["high"] > 0:
            print(f"🔴 Problemas críticos: {severity_count['high']}")
        if severity_count["medium"] > 0:
            print(f"🟡 Problemas moderados: {severity_count['medium']}")
        if severity_count["low"] > 0:
            print(f"🟢 Problemas menores: {severity_count['low']}")
        
        print(f"\n📋 TIPOS DE PROBLEMAS:")
        for issue_type, count in issue_types.items():
            print(f"  • {issue_type.replace('_', ' ').title()}: {count}")
        
        # Mostrar los problemas más críticos
        critical_issues = [issue for issue in self.issues_found if issue['severity'] == 'high']
        if critical_issues:
            print(f"\n🔴 PROBLEMAS CRÍTICOS QUE REQUIEREN ATENCIÓN:")
            for i, issue in enumerate(critical_issues[:5]):  # Mostrar máximo 5
                print(f"\n{i+1}. {issue['description']}")
                print(f"   Chunk: {issue.get('chunk_number', issue['chunk_index'] + 1)}")
                if 'preview' in issue:
                    print(f"   Vista previa: {issue['preview']}")
    
    def show_detailed_issues(self):
        """Mostrar detalles de todos los problemas encontrados"""
        if not self.issues_found:
            print("✅ No se encontraron problemas")
            return
        
        print(f"\n📝 DETALLE DE TODOS LOS PROBLEMAS ({len(self.issues_found)}):")
        print("=" * 80)
        
        for i, issue in enumerate(self.issues_found):
            severity_icon = {"high": "🔴", "medium": "🟡", "low": "🟢"}[issue['severity']]
            
            print(f"\n{i+1}. {severity_icon} {issue['type'].replace('_', ' ').upper()}")
            print(f"   Descripción: {issue['description']}")
            print(f"   Chunk: {issue.get('chunk_number', f"#{issue['chunk_index'] + 1}")}")
            print(f"   Índice: {issue['chunk_index']}")
            
            if 'preview' in issue:
                print(f"   Vista previa: {issue['preview']}")
            if 'content' in issue:
                print(f"   Contenido: {issue['content']}")
            if 'word_count' in issue:
                print(f"   Palabras: {issue['word_count']}")
            
            print("   " + "-" * 40)
    
    def export_issues_report(self, output_path: str):
        """Exportar reporte de problemas a JSON"""
        report = {
            "analysis_date": "2025-08-06",
            "total_issues": len(self.issues_found),
            "issues_by_severity": {
                "high": len([i for i in self.issues_found if i['severity'] == 'high']),
                "medium": len([i for i in self.issues_found if i['severity'] == 'medium']),
                "low": len([i for i in self.issues_found if i['severity'] == 'low'])
            },
            "issues": self.issues_found
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"📄 Reporte exportado: {output_path}")

def main():
    """Función principal para análisis de chunks"""
    analyzer = ChunkAnalyzer()
    
    print("🔍 ANALIZADOR DE CALIDAD DE CHUNKS")
    print("=" * 50)
    
    # Listar archivos disponibles
    print("📁 Archivos disponibles para analizar:")
    available_files = []
    for file in os.listdir("output"):
        if file.endswith("_legal_cleaned.json"):
            available_files.append(file)
            print(f"  {len(available_files)}. {file}")
    
    if not available_files:
        print("❌ No hay archivos disponibles para analizar")
        return
    
    # Seleccionar archivo
    try:
        choice = int(input("\nSelecciona el archivo a analizar (número): ")) - 1
        if 0 <= choice < len(available_files):
            file_path = f"output/{available_files[choice]}"
            
            # Realizar análisis
            results = analyzer.analyze_document(file_path)
            
            # Opciones adicionales
            while True:
                print(f"\n🔧 OPCIONES:")
                print("1. Ver detalles de todos los problemas")
                print("2. Exportar reporte de problemas")
                print("3. Abrir editor manual")
                print("4. Salir")
                
                option = input("Selecciona una opción: ").strip()
                
                if option == "1":
                    analyzer.show_detailed_issues()
                elif option == "2":
                    report_path = f"output/{os.path.basename(file_path)}_analysis_report.json"
                    analyzer.export_issues_report(report_path)
                elif option == "3":
                    print("\n🚀 Iniciando editor manual...")
                    os.system("python manual_editor.py")
                    break
                elif option == "4":
                    break
                else:
                    print("❌ Opción inválida")
        else:
            print("❌ Selección inválida")
    except (ValueError, KeyboardInterrupt):
        print("\n👋 Análisis cancelado")

if __name__ == "__main__":
    main()
