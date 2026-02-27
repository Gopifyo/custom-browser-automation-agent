import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from vision import VisionExtractor
from trade_client import TradeClient
from browser_agent import BrowserAutomation
import shutil
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

# Initialize Agents
vision_agent = VisionExtractor()
trade_client = TradeClient()
browser_agent = BrowserAutomation()

class HTSLookupRequest(BaseModel):
    description: str

@app.get("/health")
async def health_check():
    return {"status": "online", "service": "customs-ghost"}

@app.post("/lookup-hts")
async def lookup_hts(request: HTSLookupRequest):
    """
    Trigger the Browser Agent to search USITC.
    """
    return await browser_agent.lookup_hts_code(request.description)

@app.post("/analyze")
async def analyze_invoice(file: UploadFile = File(...)):
    """
    Receives an image/PDF from Frontend (Drag&Drop or Screen Capture).
    Returns extracted Trade Compliance JSON.
    """
    try:
        print(f"📥 Received file: {file.filename}")
        
        # Run Vision Extraction
        vision_response = await vision_agent.extract_invoice_data(temp_path)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Handle Vision Error
        if isinstance(vision_response, dict) and "error" in vision_response:
             return {"status": "error", "message": vision_response["error"]}

        # Parse Vision Result
        import json
        clean_json = vision_response.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)

        # Run Trade Compliance Logic
        hs_code = data.get("declared_hs_code")
        origin = data.get("origin_country")
        
        section_301_result = trade_client.check_section_301(hs_code, origin)
        
        # Augment Data
        data["trade_compliance"] = {
            "section_301": section_301_result,
            "is_valid_format": trade_client.validate_hs_code(hs_code)
        }
        
        # Determine overall status
        if section_301_result.get("applies"):
             data["potential_mismatch"] = True
             data["compliance_alert"] = section_301_result["message"]

        return {"status": "success", "data": json.dumps(data)}
        
    except Exception as e:
        print(f"❌ API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount Frontend
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("frontend/dist/index.html")
else:
    print("⚠️ Frontend dist not found. Run 'npm run build' first.")


if __name__ == "__main__":
    print("🚀 Starting Customs Ghost API on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
