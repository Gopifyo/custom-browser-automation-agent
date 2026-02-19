from typing import Dict, Optional

class ComplianceEngine:
    """
    The 'Section 301 Database' and Verification Engine.
    In a real app, this would query an SQL DB or the USTR API.
    For the hackathon, we use a static lookup for the demo flows.
    """
    
    def __init__(self):
        # The "Database" of Section 301 Tariffs (China Focus)
        self.section_301_db = {
            "China": {
                "active": True,
                "lists": {
                    "List 3": {"duty": 0.25, "notes": "USTR Notice 9903.88.03"},
                    "List 4A": {"duty": 0.075, "notes": "USTR Notice 9903.88.15"}
                },
                # Example: High-speed cables, Metal furniture, etc.
                "flagged_hs_prefixes": ["8544", "9403", "7304"]
            }
        }

    def check_section_301(self, hs_code: str, origin_country: str) -> Dict:
        """
        Tool provided to the Agent.
        Returns tariff info if the item is subject to trade war duties.
        """
        print(f"🔎 Checking Section 301 Database for: {hs_code} from {origin_country}")
        
        country_data = self.section_301_db.get(origin_country)
        
        if not country_data or not country_data["active"]:
            return {"hit": False, "duty": 0.0, "message": "No special tariffs found."}

        # Check if HS Code prefix matches any restricted lists
        # Clean the HS Code (remove dots)
        clean_code = hs_code.replace(".", "")
        
        for prefix in country_data["flagged_hs_prefixes"]:
            if clean_code.startswith(prefix):
                return {
                    "hit": True,
                    "duty": 0.25, # Defaulting to List 3 for demo
                    "message": f"⚠️ CRITICAL: Item under HTS {hs_code} from {origin_country} is subject to Section 301 Duties (25% Additional Tax).",
                    "authority": "General Note 9903.88"
                }

        return {"hit": False, "duty": 0.0, "message": "Cleared Section 301 check."}

# Verification
if __name__ == "__main__":
    engine = ComplianceEngine()
    print(engine.check_section_301("9403.10", "China"))
