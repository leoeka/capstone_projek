from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
from .inference.engine import ai_engine

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulasi Database Pekerjaan
MOCK_JOBS = [
    {"id": 1, "title": "Frontend Developer", "desc": "React JavaScript HTML CSS Tailwind"},
    {"id": 2, "title": "Python Backend", "desc": "Python FastAPI PostgreSQL Docker AI"},
    {"id": 3, "title": "Data Scientist", "desc": "Machine Learning Python SQL Pandas Scikit-learn"},
]

@app.post("/scan-cv")
async def scan_cv(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    cv_text = ""
    for page in doc:
        cv_text += page.get_text()
    
    recommendations = ai_engine.predict(cv_text, MOCK_JOBS)
    
    return {
        "filename": file.filename,
        "recommendations": recommendations
    }

