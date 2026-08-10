import os
import sqlite3
import json
import numpy as np

# Fail-safe import of sentence-transformers
try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    print("[Vector Store] WARNING: sentence-transformers not found or failed to load. Falling back to keyword-overlap vector indexing.")
    HAS_TRANSFORMERS = False

class LocalVectorStore:
    def __init__(self, db_path="papers_vector_store.db"):
        self.db_path = db_path
        self.use_model = HAS_TRANSFORMERS
        
        if self.use_model:
            try:
                print("[Vector Store] Loading local embeddings model (all-MiniLM-L6-v2)...")
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                print(f"[Vector Store] Error initializing model: {e}. Falling back to keyword search.")
                self.use_model = False
                
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        # Table to store paper metadata
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS papers (
                id TEXT PRIMARY KEY,
                title TEXT,
                filename TEXT
            )
        ''')
        # Table to store chunks
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                paper_id TEXT,
                text TEXT,
                embedding BLOB,
                metadata TEXT,
                FOREIGN KEY (paper_id) REFERENCES papers (id)
            )
        ''')
        conn.commit()
        conn.close()

    def add_paper(self, paper_id: str, title: str, filename: str, sentences: list):
        """
        Chunks the sentences, embeds them, and indexes in local SQLite vector database.
        Each chunk consists of 5 overlapping sentences (sliding window of 2).
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Add paper metadata
        cursor.execute("INSERT OR REPLACE INTO papers (id, title, filename) VALUES (?, ?, ?)", 
                       (paper_id, title, filename))
        
        # Semantic chunking
        chunk_size = 5
        overlap = 2
        
        chunks = []
        for i in range(0, len(sentences), chunk_size - overlap):
            chunk_sentences = sentences[i : i + chunk_size]
            if not chunk_sentences:
                break
            
            chunk_text = " ".join([s["text"] for s in chunk_sentences])
            chunk_meta = {
                "sentences": chunk_sentences
            }
            chunks.append((chunk_text, chunk_meta))
            
        print(f"[Vector Store] Chunked paper into {len(chunks)} segments...")
        
        if self.use_model:
            try:
                print(f"[Vector Store] Embedding {len(chunks)} chunks using all-MiniLM-L6-v2...")
                texts = [c[0] for c in chunks]
                embeddings = self.model.encode(texts, show_progress_bar=False)
                
                for (text, meta), emb in zip(chunks, embeddings):
                    emb_blob = emb.astype(np.float32).tobytes()
                    meta_str = json.dumps(meta)
                    cursor.execute(
                        "INSERT INTO chunks (paper_id, text, embedding, metadata) VALUES (?, ?, ?, ?)",
                        (paper_id, text, emb_blob, meta_str)
                    )
                conn.commit()
                conn.close()
                print(f"[Vector Store] Indexing complete for paper {paper_id}.")
                return
            except Exception as e:
                print(f"[Vector Store] Embedding failed: {e}. Falling back to keyword storage.")
                
        # Keyword-based Fallback Storage
        # If models fail to run, we just store empty embeddings and rank by keyword overlap during search
        print("[Vector Store] Storing chunks in keyword index...")
        for text, meta in chunks:
            # Empty embedding blob
            emb_blob = np.zeros(384, dtype=np.float32).tobytes()
            meta_str = json.dumps(meta)
            cursor.execute(
                "INSERT INTO chunks (paper_id, text, embedding, metadata) VALUES (?, ?, ?, ?)",
                (paper_id, text, emb_blob, meta_str)
            )
            
        conn.commit()
        conn.close()
        print(f"[Vector Store] Indexing complete for paper {paper_id}.")

    def search(self, paper_id: str, query: str, top_k=5):
        """
        Encodes query and performs search. Uses cosine similarity if model is active, 
        otherwise falls back to clean keyword overlap search.
        """
        if self.use_model:
            try:
                query_emb = self.model.encode([query])[0].astype(np.float32)
                
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute("SELECT id, text, embedding, metadata FROM chunks WHERE paper_id = ?", (paper_id,))
                rows = cursor.fetchall()
                conn.close()
                
                results = []
                for row_id, text, emb_blob, metadata in rows:
                    emb = np.frombuffer(emb_blob, dtype=np.float32)
                    norm_q = np.linalg.norm(query_emb)
                    norm_e = np.linalg.norm(emb)
                    if norm_q > 0 and norm_e > 0:
                        score = float(np.dot(query_emb, emb) / (norm_q * norm_e))
                    else:
                        score = 0.0
                        
                    results.append({
                        "chunk_id": row_id,
                        "text": text,
                        "score": score,
                        "metadata": json.loads(metadata)
                    })
                    
                results.sort(key=lambda x: x["score"], reverse=True)
                return results[:top_k]
            except Exception as e:
                print(f"[Vector Store] Model search failed: {e}. Falling back to keyword ranking.")
                
        # Keyword Search Fallback: Count word overlap
        query_words = set(query.lower().split())
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, text, metadata FROM chunks WHERE paper_id = ?", (paper_id,))
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for row_id, text, metadata in rows:
            text_words = text.lower().split()
            overlap = sum(1 for w in query_words if w in text_words)
            # Normalize score
            score = float(overlap) / max(len(query_words), 1)
            
            results.append({
                "chunk_id": row_id,
                "text": text,
                "score": score,
                "metadata": json.loads(metadata)
            })
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
