# Customs Ghost 👻

**Autonomous Trade Compliance Agent** for the Y Combinator "Browser Use" Hackathon.

## 🚀 Mission
Prevent "Invisible Fines" in global trade by autonomously auditing shipping invoices against high-security government portals (US ACE / USITC).

## 🛠️ Tech Stack
*   **Agent Core**: `browser-use` + `playwright`
*   **Vision Layer**: Google Gemini 2.0 Flash
*   **MFA Bridge**: `agentmail`
*   **Frontend**: React + Vite + Tailwind CSS (Enterprise UI)
*   **Backend**: Python FastAPI

## 📦 Installation

1.  **Clone the repo**
2.  **Backend Setup**:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r backend/requirements.txt
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
4.  **Environment**:
    Create a `.env` file with:
    ```
    GEMINI_API_KEY=your_key_here
    AGENTMAIL_API_KEY=your_key_here
    ```

## 🎮 Usage
1.  Open Dashboard: `http://localhost:5173`
2.  Click **"Connect Screen Source"** (Share your Invoice PDF window).
3.  Click **"RUN COMPLIANCE CHECK"**.
4.  Watch the Agent analyze the document and verify HS Codes in real-time.
