import os
import re
import time
import asyncio
from agentmail import AgentMail

# Placeholder for AgentMail API Key - User to set in .env
# os.environ["AGENTMAIL_API_KEY"] = "your_key_here"

class MFABridge:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("AGENTMAIL_API_KEY")
        if not self.api_key:
            print("WARNING: AGENTMAIL_API_KEY not found.")
        self.client = AgentMail(api_key=self.api_key) if self.api_key else None
        self.target_email = "customs-bot@agentmail.to" # Configurable

    async def get_latest_code(self, inbox_id: str, timeout: int = 60) -> str | None:
        """
        Polls Agentmail for the latest code with Exponential Backoff.
        Regex: \b\d{6}\b to exact match 6-digit codes.
        """
        if not self.client:
            print("Error: AgentMail client not initialized.")
            return None

        start_time = time.time()
        attempt = 0
        
        print(f"Waiting for MFA code in inbox: {inbox_id}...")
        
        while time.time() - start_time < timeout:
            try:
                # Poll inbox logic here (pseudo-code as AgentMail API specifics verify)
                # In strict implementation we would use: client.messages.list(inbox_id=...)
                messages = self.client.inboxes.messages.list(inbox_id=inbox_id, limit=1)
                
                if messages:
                    latest_message = messages[0]
                    # Regex to find exactly 6 digits, ignoring other numbers
                    match = re.search(r'\b\d{6}\b', latest_message.text)
                    if match:
                        code = match.group(0)
                        print(f"MFA Code Found: {code}")
                        return code
                
                # Exponential Backoff: 1s, 2s, 4s, 8s... capped at 10s
                wait_time = min(2 ** attempt, 10)
                print(f"No code yet. Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
                attempt += 1

            except Exception as e:
                print(f"Error polling AgentMail: {e}")
                await asyncio.sleep(1)
        
        print("Timeout waiting for MFA code.")
        return None

# Usage Example
if __name__ == "__main__":
    bridge = MFABridge()
    # verify logic with: asyncio.run(bridge.get_latest_code("your_inbox_id"))
