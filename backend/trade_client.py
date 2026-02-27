from typing import Dict, Any, Optional

class TradeClient:
    """
    Handles trade compliance logic, specifically US Section 301 (China Tariffs)
    and basic HTS code validation.
    """
    
    def __init__(self):
        # Section 301 List 3 (25% Duty) Prefixes (Simplified for Demo)
        # Real list is thousands of codes.
        self.section_301_list_3 = [
            "8544", # Insulated wire, cable
            "9403", # Other furniture
            "7304", # Tubes, pipes of iron/steel
            "8708", # Parts of motor vehicles
            "8409", # Parts of engines
            "8504", # Transformers
        ]
        
        # Section 301 List 4A (7.5% Duty) Prefixes
        self.section_301_list_4a = [
            "6205", # Men's shirts
            "6110", # Sweaters
            "9503", # Toys
            "6403", # Footwear
        ]

    def validate_hs_code(self, hs_code: str) -> bool:
        """
        Basic regex/format check for HTS codes.
        Expected format: 4 to 10 digits, optionally with dots.
        """
        if not hs_code:
            return False
        clean_code = hs_code.replace('.', '').strip()
        return clean_code.isdigit() and 4 <= len(clean_code) <= 10

    def check_section_301(self, hs_code: str, origin_country: str) -> Dict[str, Any]:
        """
        Checks if the goods are subject to Section 301 duties based on Origin and HS Code.
        """
        if not origin_country or "china" not in origin_country.lower():
            return {"applies": False, "reason": "Origin is not China"}
            
        if not hs_code:
             return {"applies": False, "reason": "No HS Code provided"}

        clean_code = hs_code.replace('.', '').strip()
        
        # Check List 3
        for prefix in self.section_301_list_3:
            if clean_code.startswith(prefix):
                 return {
                     "applies": True, 
                     "list": "List 3", 
                     "rate": 0.25, 
                     "message": "Subject to Section 301 List 3 Duties (25%)"
                 }
                 
        # Check List 4A
        for prefix in self.section_301_list_4a:
            if clean_code.startswith(prefix):
                 return {
                     "applies": True, 
                     "list": "List 4A", 
                     "rate": 0.075, 
                     "message": "Subject to Section 301 List 4A Duties (7.5%)"
                 }
                 
        return {"applies": False, "reason": "HS Code not found in Section 301 Lists"}

    def compute_landed_cost(self, value: float, duty_rate: float) -> float:
        return value * (1 + duty_rate)
