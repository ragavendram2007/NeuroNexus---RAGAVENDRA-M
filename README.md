# ACADEMIQ: AUTONOMOUS RESEARCH BRIEFING AGENT

> **ACADEMIQ** is an advanced Multi-Agent Retrieval-Augmented Generation (RAG) platform that transforms dense academic articles into layout-aware, critique-audited interactive dossiers. By replacing generic single-prompt summarization with a self-reflecting agent loop, ACADEMIQ maps arguments, exposes statistical gaps, and synchronizes flashcards directly to precise coordinates in source PDFs.

---

##  Key Features

1. **Academic Auditor Agent (Rigor Analysis)**: Replaces simple summaries. It reviews paper text like a harsh peer-reviewer, highlighting small sample sizes, missing baselines, control flaws, and logic leaps.
2. **Argument & Evidence Map (React Flow)**: A node-link graph mapping the structure of the scientific argument. Instead of a vocabulary cloud, it links **CLAIMS** to **EVIDENCE** and **AUDIT WARNINGS**.
3. **Chain-of-Thought / Verification Console**: A live streaming terminal showing the multi-agent negotiation. Watch the **Verifier Agent** cross-check and correct the **Synthesizer Agent**'s claims against the Vector DB in real-time.
4. **Contextual Flashcard Interventions**: Interactive Anki-style active recall cards. If you fail a card, the interface immediately auto-scrolls the PDF viewer to the exact paragraph, highlighting it in neon purple.
5. **ELI5 (Explain Like I'm 5) Translation Matrix**: Toggle between dense academic text and simplified terms that use everyday analogies (e.g. explaining Self-Attention like a cocktail party).

---

##  Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       REACT FRONTEND                        │
   │   (Vite + TS + Tailwind + React Flow + Interactive PDF)    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ JSON Stream / SSE
   ┌──────────────────────────────▼──────────────────────────────┐
   │                      FASTAPI BACKEND                        │
   │          (Multi-Agent Orchestration & Parsing)              │
   └──────┬───────────────────────┬───────────────────────┬──────┘
          │                       │                       │
┌─────────▼──────────┐ ┌──────────▼──────────┐ ┌──────────▼──────────┐
│     PyMuPDF        │ │SentenceTransformers │ │   SQLite Vector     │
│ (Coordinate Parser)│ │ (Local Embeddings)  │ │   (Local Store)     │
└────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide icons, `@xyflow/react` (React Flow), `canvas-confetti`.
* **Backend**: FastAPI (Python 3.14), Uvicorn, PyMuPDF (fitz), SentenceTransformers (all-MiniLM-L6-v2), Pydantic, SQLite, OpenAI client.

---

##  Getting Started & Setup

ACADEMIQ features a **dual-execution system**:
1. **Demo Mode (Default)**: Runs a high-fidelity local workspace using the seminal paper *"Attention Is All You Need"* with full coordinate highlights, an argument map, and flashcards. Perfect for offline pitches and 15-second live demos.
2. **Live API Mode**: Connects to the FastAPI backend to parse custom uploads using local models or remote OpenAI endpoints.

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your environment variables (optional for live OpenAI runs, local emulations run out-of-the-box):
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY="your-api-key"
   ```
4. Run the development server:
   ```bash
   python main.py
   ```
   *The backend will start running on `http://localhost:8000`.*

### 2. Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Boot the Vite development environment:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will load on `http://localhost:5173`.*

---



---

## 📄 References & Scientific Basis
* **RAG Basis**: Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."
* **Decision Loop**: Yao, S., et al. (2022). "ReAct: Synergizing Reasoning and Acting in Language Models."
* **Self-Reflection**: Asai, A., et al. (2023). "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection."
* **Layout Preserving**: Huang, Y., et al. (2022). "LayoutLMv3: Pre-training for Document AI."
