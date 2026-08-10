import os
import uuid
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel

from parser import extract_pdf_structure
from vector_store import LocalVectorStore
from agents import run_agentic_pipeline

app = FastAPI(
    title="ACADEMIQ API Backend",
    description="Autonomous Research Briefing & Rigor Auditing Agent API",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (usually localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize global Vector Store
vector_store = LocalVectorStore()

class AuditRequest(BaseModel):
    paper_id: str
    title: str
    api_key: str = None

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ACADEMIQ backend"}

@app.post("/api/upload")
async def upload_paper(file: UploadFile = File(...)):
    """
    Accepts PDF upload, runs layout-aware sentence extraction, 
    and indexes the contents into the local Vector DB.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    paper_id = str(uuid.uuid4())
    filename = f"{paper_id}.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save PDF locally
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    print(f"[Backend] File saved to {file_path}. Starting layout-aware parsing...")
    
    try:
        # Extract sentences and coordinates
        sentences = extract_pdf_structure(file_path)
        print(f"[Backend] Parsed {len(sentences)} sentences. Indexing into vector store...")
        
        # Add to local vector database
        title = file.filename.replace(".pdf", "")
        vector_store.add_paper(paper_id, title, filename, sentences)
        
        # Keep structured sentences cached in memory/json for coordinate highlights
        sentences_cache_path = os.path.join(UPLOAD_DIR, f"{paper_id}_sentences.json")
        with open(sentences_cache_path, "w", encoding="utf-8") as f:
            json.dump(sentences, f, ensure_ascii=False, indent=2)
            
        return {
            "paper_id": paper_id,
            "title": title,
            "filename": file.filename,
            "sentences_count": len(sentences)
        }
    except Exception as e:
        print(f"[Backend] Error processing PDF: {str(e)}")
        # Clean up failed file
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@app.get("/api/audit-stream")
def audit_stream(paper_id: str, title: str, api_key: str = None):
    """
    SSE stream endpoint for Agentic Chain-of-Thought logs and final report output.
    """
    # Load sentences structure cache
    sentences_cache_path = os.path.join(UPLOAD_DIR, f"{paper_id}_sentences.json")
    
    # Fallback to empty list if not found
    sentences = []
    if os.path.exists(sentences_cache_path):
        with open(sentences_cache_path, "r", encoding="utf-8") as f:
            sentences = json.load(f)
            
    return StreamingResponse(
        run_agentic_pipeline(paper_id, title, sentences, vector_store, api_key),
        media_type="text/event-stream"
    )

@app.get("/api/papers/{paper_id}/pdf")
def get_pdf(paper_id: str):
    """
    Serves the raw PDF file for display/download in the PDF viewer panel.
    """
    file_path = os.path.join(UPLOAD_DIR, f"{paper_id}.pdf")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF not found.")
    return FileResponse(file_path, media_type="application/pdf")

@app.get("/api/papers/{paper_id}/sentences")
def get_sentences(paper_id: str):
    """
    Returns the parsed layout sentences for PDF rendering in the workspace.
    """
    sentences_cache_path = os.path.join(UPLOAD_DIR, f"{paper_id}_sentences.json")
    if not os.path.exists(sentences_cache_path):
        raise HTTPException(status_code=404, detail="Sentences not found.")
    with open(sentences_cache_path, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
