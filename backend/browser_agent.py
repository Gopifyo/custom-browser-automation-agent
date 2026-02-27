import os
import asyncio
import json
from dotenv import load_dotenv

# Conditional Import for browser-use (fails on Python 3.14 local, works in Docker 3.11)
try:
    from browser_use import Agent
    from langchain_google_genai import ChatGoogleGenerativeAI
    BROWSER_USE_AVAILABLE = True
except ImportError:
    BROWSER_USE_AVAILABLE = False
    print("⚠️ browser-use or langchain_google_genai not found. Browser features will be mocked or disabled.")

load_dotenv()

class BrowserAutomation:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        # Ensure we have API key and imports
        self.is_active = BROWSER_USE_AVAILABLE and self.api_key

    async def lookup_hts_code(self, description: str):
        """
        Spins up a headless browser, navigates to USITC, scours for the HTS code.
        """
        if not self.is_active:
            return {"status": "skipped", "reason": "Environment not supported (run in Docker)"}

        print(f"🌍 Browser Agent: Initiating Search for '{description}'...")
        
        try:
            # Initialize Gemini via LangChain (required by browser-use)
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash-exp",
                google_api_key=self.api_key
            )

            # Precise Task Definition
            task = f"""
            1. Navigate to https://hts.usitc.gov/
            2. Type '{description}' into the search bar.
            3. Click the 'Search' button.
            4. Wait for results to load.
            5. Extract the first HTS Item Number and its Article Description.
            6. Return the result strictly as JSON: {{ "hs_code": "...", "description": "..." }}
            """

            # Initialize Agent
            agent = Agent(
                task=task,
                llm=llm,
            )

            # Execution
            # agent.run() returns a History object, usually we want the final result
            history = await agent.run()
            result = history.final_result()
            
            print(f"✅ Browser Agent Result: {result}")
            
            # Attempt to parse JSON from the result string if needed
            try:
                # Cleanup potential markdown code blocks
                clean_res = result.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_res)
            except:
                return {"raw_result": result}

        except Exception as e:
            print(f"❌ Browser Agent Failed: {e}")
            return {"error": str(e)}
