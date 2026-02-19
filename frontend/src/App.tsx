import React, { useState, useRef } from 'react';
import AutonomousCursor from './components/AutonomousCursor';
import StatusPanel from './components/StatusPanel';

interface ComplianceResult {
  description: string | null;
  declared_hs_code: string | null;
  origin_country: string | null;
  potential_mismatch: boolean;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

function App() {
  const [status, setStatus] = useState<'SAFE' | 'DANGER' | 'ANALYZING' | 'IDLE'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ComplianceResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const startScreenShare = async () => {
    try {
      // @ts-ignore
      const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "window" } });
      setStream(captureStream);
      if (videoRef.current) videoRef.current.srcObject = captureStream;
      addLog("Connected to ERP Screen Share.");
      setStatus('ANALYZING');
    } catch (err) {
      console.error(err);
      addLog("Failed to connect to screen.");
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !stream) return;

    addLog("Capturing frame for analysis...");

    // 1. Capture Frame
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    // 2. Convert to Blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        // 3. Send to API
        const formData = new FormData();
        formData.append("file", blob, "screen-capture.png");

        addLog("Sending to Vision Agent...");
        const res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        addLog("Analysis Complete.");

        // Parse Gemini Result (Mocking parsing logic for demo)
        const parsed = JSON.parse(data.data.replace(/```json/g, '').replace(/```/g, ''));
        setAnalysisResult({
          ...parsed,
          status: parsed.potential_mismatch ? 'WARNING' : 'SAFE'
        });
        setStatus(parsed.potential_mismatch ? 'DANGER' : 'SAFE');

      } catch (e) {
        console.error(e);
        addLog("Error analyzing frame.");
      }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex overflow-hidden selection:bg-violet-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1322] border-r border-slate-800/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] mr-3"></div>
          <span className="font-bold tracking-tight text-lg">Customs Ghost</span>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <div className="px-4 py-3 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/20 text-sm font-medium cursor-pointer">
            📊 Dashboard
          </div>
          <div className="px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors text-sm font-medium cursor-pointer">
            📜 Invoices
          </div>
          <div className="px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors text-sm font-medium cursor-pointer">
            ⚖️ Rules Engine
          </div>
          <div className="px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors text-sm font-medium cursor-pointer">
            ⚙️ Settings
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500"></div>
            <div>
              <div className="text-sm font-medium">Compliance Officer</div>
              <div className="text-xs text-slate-500">Online • US-EAST-1</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <AutonomousCursor />

        {/* Header */}
        <header className="h-16 border-b border-slate-800/50 bg-[#0B0F19]/80 backdrop-blur flex items-center justify-between px-8">
          <h2 className="font-medium text-slate-200">Active Audit Session #8492-AC</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              HTS Database: CONNECTED
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Vision Mode: GEMINI 2.0
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 flex gap-6 overflow-hidden">

          {/* Left Column: Input & Analysis */}
          <div className="w-7/12 flex flex-col gap-6">
            {/* Visual Input Feed */}
            <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/60 overflow-hidden relative shadow-2xl">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white border border-white/10 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stream ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                  {stream ? 'LIVE ERP FEED' : 'NO SIGNAL'}
                </div>
              </div>

              {stream ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain bg-black" />
                  <button
                    onClick={captureAndAnalyze}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2 group"
                  >
                    <span className="group-hover:animate-pulse">✨</span> RUN COMPLIANCE CHECK
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                  <div className="p-4 rounded-full bg-slate-800/50 mb-4 animate-pulse">
                    <span className="text-4xl">📡</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-400 mb-1">No Input Source</h3>
                  <p className="text-sm text-slate-500 mb-6">Connect to an ERP system or upload an invoice.</p>
                  <button
                    onClick={startScreenShare}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all text-sm font-medium"
                  >
                    Connect Screen Source
                  </button>
                </div>
              )}
            </div>

            {/* Analysis Results Card */}
            {analysisResult && (
              <div className="h-48 bg-slate-900/50 rounded-2xl border border-slate-800/60 p-6 flex gap-6 animate-in slide-in-from-bottom-5">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Vision Analysis</h3>
                    {analysisResult.status === 'WARNING' && <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-bold border border-red-500/20">MISMATCH DETECTED</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Detected HS Code</div>
                      <div className="text-lg font-mono font-medium">{analysisResult.declared_hs_code}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Origin Country</div>
                      <div className="text-lg font-mono font-medium">{analysisResult.origin_country}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {analysisResult.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Agent Activity */}
          <div className="w-5/12 flex flex-col gap-6">
            <StatusPanel
              status={status === 'DANGER' ? 'DANGER' : status === 'ANALYZING' ? 'ANALYZING' : 'SAFE'}
              message={status === 'DANGER'
                ? "CRITICAL: Detected 'Dental Chair' (9402) misclassified as 'Office Furniture' (9403). Section 301 Duty Risk."
                : status === 'ANALYZING'
                  ? "Agent is reading document and cross-referencing USITC HTS Database..."
                  : "System Ready. Waiting for audit task."
              }
            />

            {/* Agent Browser View */}
            <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800/60 overflow-hidden flex flex-col">
              <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5 opacity-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-mono text-slate-600">AGENT BROWSER VIEW</span>
                </div>
              </div>
              <div className="flex-1 bg-[#1A1E29] p-4 font-mono text-xs overflow-y-auto space-y-2">
                {logs.length === 0 && <span className="text-slate-600">Agent logs will appear here...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400 border-l-2 border-green-500/20 pl-2">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
