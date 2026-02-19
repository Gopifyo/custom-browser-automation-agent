import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from vision import VisionExtractor
import shutil

# Load env vars
load_dotenv()

app = FastAPI(title="Customs Ghost API")

# Configure CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vision Agent
vision_agent = VisionExtractor()

@app.get("/health")
async def health_check():
    return {"status": "online", "service": "customs-ghost"}

@app.post("/analyze")
async def analyze_invoice(file: UploadFile = File(...)):
    """
    Receives an image/PDF from Frontend (Drag&Drop or Screen Capture).
    Returns extracted Trade Compliance JSON.
    """
    try:
        print(f"📥 Received file: {file.filename}")
        
        # Save temp file
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run Vision Extraction
        result_json_str = await vision_agent.extract_invoice_data(temp_path)
        
        # Cleanup
        os.remove(temp_path)
        
        return {"status": "success", "data": result_json_str}
        
    except Exception as e:
        print(f"❌ API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Customs Ghost API on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
