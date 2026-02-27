import google.generativeai as genai
import os

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found. Vision features will fail or need mocking.")

class VisionExtractor:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    async def extract_invoice_data(self, image_path: str):
        """
        Uses Gemini 2.0 Flash to extract shipping data from an image/PDF.
        """
        print(f"👁️ Vision Agent analyzing: {image_path}")
        

        # 1. Determine Mime Type
        file_ext = os.path.splitext(image_path)[1].lower()
        mime_type = "application/pdf" if file_ext == ".pdf" else "image/jpeg"

        # 2. Load the image/file
        # In a real app, handle PDF->Image conversion or direct PDF upload
        # For hackathon simplicity, we assume image_path is a local file (jpg/png/pdf)
        if not os.path.exists(image_path):
             return {"error": "File not found"}

        with open(image_path, "rb") as f:
            file_data = f.read()

        # 3. Construct the Prompt with JSON Schema enforcement
        prompt = """
        You are an expert Trade Compliance Officer. Analyze this shipping invoice or ERP screen capture.
        Extract the following fields strictly as JSON:
        
        {
            "description": "The commercially described name of the goods",
            "declared_hs_code": "The HS Code listed on the document (digits and dots only)",
            "origin_country": "The Country of Origin / Manufacture",
            "destination_country": "The 'Ship To' country",
            "total_value": "The total value of the shipment (number only)"
        }

        If a field is missing, use null.
        """
        
        try:
            # 4. Call Gemini
            response = self.model.generate_content(
                [
                    {"mime_type": mime_type, "data": file_data},
                    prompt
                ],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            
            print("✅ Vision Analysis Complete")
            return response.text
            
        except Exception as e:
            print(f"❌ Vision Error: {e}")
            return {"error": str(e)}

if __name__ == "__main__":
    extractor = VisionExtractor()
    print("Vision Extractor Initialized")
