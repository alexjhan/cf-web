import os
import io
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2 import service_account

class PDFLoader:
    def __init__(self, service_account_path, folder_id):
        self.service_account_path = service_account_path
        self.folder_id = folder_id
        self.service = self._connect_drive()

    def _connect_drive(self):
        creds = service_account.Credentials.from_service_account_file(
            self.service_account_path,
            scopes=["https://www.googleapis.com/auth/drive"]
        )
        return build('drive', 'v3', credentials=creds)

    def list_pdfs(self):
        query = f"'{self.folder_id}' in parents and mimeType='application/pdf'"
        results = self.service.files().list(q=query, fields="files(id, name)").execute()
        return results.get('files', [])

    def download_pdf(self, file_id, file_name, dest_folder):
        request = self.service.files().get_media(fileId=file_id)
        fh = io.FileIO(os.path.join(dest_folder, file_name), 'wb')
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        try:
            while not done:
                status, done = downloader.next_chunk()
        except Exception as e:
            print(f"Error descargando {file_name}: {e}")
            return False
        return True

    def extract_text_structured(self, pdf_path):
        doc_struct = {"file": pdf_path, "content": []}
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                blocks = page.get_text("dict")['blocks']
                for block in blocks:
                    if block['type'] == 0:  # texto
                        for line in block['lines']:
                            for span in line['spans']:
                                doc_struct["content"].append({
                                    "text": span['text'],
                                    "font": span.get('font', ''),
                                    "size": span.get('size', 0),
                                    "flags": span.get('flags', 0),
                                    "bold": bool(span.get('flags', 0) & 2),
                                    "italic": bool(span.get('flags', 0) & 1)
                                })
        except Exception as e:
            print(f"Error extrayendo texto de {pdf_path}: {e}")
            # Fallback a pdfminer si PyMuPDF falla
            try:
                text = extract_text(pdf_path)
                doc_struct["content"].append({"text": text, "font": "", "size": 0, "flags": 0, "bold": False, "italic": False})
            except Exception as e2:
                print(f"Error con pdfminer en {pdf_path}: {e2}")
        return doc_struct

    def process_folder(self, dest_folder):
        os.makedirs(dest_folder, exist_ok=True)
        pdfs = self.list_pdfs()
        processed_files = []
        
        for pdf in pdfs:
            file_id = pdf['id']
            file_name = pdf['name']
            print(f"Descargando: {file_name}")
            
            if self.download_pdf(file_id, file_name, dest_folder):
                doc_struct = self.extract_text_structured(os.path.join(dest_folder, file_name))
                
                # Crear JSON individual para cada PDF
                json_filename = os.path.splitext(file_name)[0] + "_processed.json"
                json_path = os.path.join(dest_folder, json_filename)
                
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(doc_struct, f, ensure_ascii=False, indent=2)
                
                print(f"Datos de {file_name} guardados en {json_filename}")
                processed_files.append({
                    "pdf_file": file_name,
                    "json_file": json_filename,
                    "content_items": len(doc_struct["content"])
                })
                
        return processed_files
# Bloque ejecutable para guardar resultados en output/ingested_data.json
if __name__ == "__main__":
    import json
    # Ajusta estas rutas según tu estructura y necesidades
    SERVICE_ACCOUNT_PATH = "../service_account.json"
    FOLDER_ID = "1f14hAevBHhQccYRQdN7dKVIR22XoXhM1"  # ID de la carpeta de Google Drive
    DEST_FOLDER = "output"
    OUTPUT_JSON = os.path.join(DEST_FOLDER, "ingested_data.json")

    loader = PDFLoader(SERVICE_ACCOUNT_PATH, FOLDER_ID)
    documentos = loader.process_folder(DEST_FOLDER)
    
    # Guardar resumen de archivos procesados
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(documentos, f, ensure_ascii=False, indent=2)
    print(f"Resumen de archivos procesados guardado en {OUTPUT_JSON}")
    print(f"Se procesaron {len(documentos)} documentos:")
    for doc in documentos:
        print(f"  - {doc['pdf_file']} -> {doc['json_file']} ({doc['content_items']} elementos)")

# Ejemplo de uso:
# loader = PDFLoader('ruta/service_account.json', 'ID_CARPETA_DRIVE')
# documentos = loader.process_folder('pdfs_descargados')
# print(documentos)
