---
name: trade-compliance
description: Verifies shipping invoices against US Custom tariffs, specificially checking HS Codes and Section 301 trade war duties.
---

# Trade Compliance Skill

Use this skill when you need to audit a shipping invoice, verify an HS Code, or check for Section 301 liability.

## When to use this skill

- You have a commercial invoice (PDF/Image) and need to extract data.
- You need to verify if an HS Code matches the goods description.
- You need to check if a product from China is subject to Section 301 tariffs.
- You need to navigate the USITC HTS search.

## Verification Checklist

1.  **Extract Data**: Identifying the "Declared HS Code", "Description of Goods", and "Country of Origin".
2.  **HTS Search**:
    - Go to `https://hts.usitc.gov/`
    - Search for the declared code (e.g., `9403.10`).
    - **Read the Chapter Notes**: Check for exclusions (e.g., "This chapter does not cover...").
3.  **Section 301 Check** (The "Trade War" Check):
    - If Origin is **China**, checking the HS Code prefix.
    - **List 3**: Duties of 25% (Subject to exclusions).
    - **List 4A**: Duties of 7.5%.
4.  **Flagging**:
    - If Description != HTS Definition -> **MISCLASSIFICATION**.
    - If Origin = China AND Section 301 applies -> **DUTY ALERT**.

## Python Implementation Pattern

When implementing this logic in `browser-use` or Python, use the following pattern:

```python
def check_compliance(hs_code, description, origin):
    # 1. Check Section 301
    section_301_prefixes = ["8544", "9403", "7304"] # Example list
    if origin == "China":
        clean_code = hs_code.replace('.', '')
        for prefix in section_301_prefixes:
            if clean_code.startswith(prefix):
                 return "ALERT: Section 301 applies (25% Duty)"
    
    # 2. Return Result
    return "SAFE: No additional duties found."
```
