import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import StatusPanel from './components/StatusPanel';
import AutonomousCursor from './components/AutonomousCursor';
import { Camera, Terminal, AlertTriangle, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceResult {
  description: string | null;
  declared_hs_code: string | null;
  origin_country: string | null;
  total_value: number | null;
  potential_mismatch: boolean;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

function App() {
  const [status, setStatus] = useState<'SAFE' | 'DANGER' | 'ANALYZING' | 'IDLE'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ComplianceResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startScreenShare = async () => {
    try {
      // @ts-ignore
      const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "window" } });
      setStream(captureStream);
      if (videoRef.current) videoRef.current.srcObject = captureStream;
      addLog("Connected to ERP Screen Share.");
      toast.success("Connected to Screen Share");
      setStatus('IDLE');
    } catch (err) {
      console.error(err);
      addLog("Failed to connect to screen.");
      toast.error("Failed to connect: " + String(err));
    }
  };

  const analyzeFile = async (file: File) => {
    setIsProcessing(true);
    setStatus('ANALYZING');
    addLog(`Analyzing file: ${file.name}...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      addLog("Sending to Vision Agent...");
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown backend error');
      }

      addLog("Analysis Complete.");
      toast.success("Analysis Complete");

      // Parse Gemini Result (Mocking parsing logic for demo)
      // Clean md formatting if present
      let jsonStr = data.data;
      if (typeof jsonStr === 'string') {
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      const parsed = JSON.parse(jsonStr);

      const result: ComplianceResult = {
        ...parsed,
        status: parsed.potential_mismatch ? 'WARNING' : 'SAFE'
      };

      setAnalysisResult(result);
      setStatus(parsed.potential_mismatch ? 'DANGER' : 'SAFE');
      setIsProcessing(false);

    } catch (e) {
      console.error(e);
      addLog("Error analyzing file.");
      // @ts-ignore
      toast.error("Analysis Failed: " + (e.message || String(e)));
      setIsProcessing(false);
      setStatus('SAFE'); // Reset on error
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !stream) return;

    addLog("Capturing frame for analysis...");
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "screen-capture.png", { type: "image/png" });
      await analyzeFile(file);
    }, 'image/png');
  };

  return (
    <Layout>
      <AutonomousCursor />
      <Header />

      <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden">

        {/* Left Column: Visual Input & Results (8 cols) */}
        <div className="col-span-8 flex flex-col gap-6 h-full">

          {/* Main Display Area */}
          <div className="flex-1 min-h-[500px] glass-panel rounded-3xl overflow-hidden relative flex flex-col group">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>

            {/* Input Toggle / Header */}
            <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-black/20 backdrop-blur-md">
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${stream ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                  Live Feed
                </button>
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${!stream ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                  Document Upload
                </button>
              </div>
              {stream && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-500 tracking-wider">LIVE FEED</span>
                </div>
              )}
            </div>

            <div className="flex-1 relative p-8 flex flex-col">
              {stream ? (
                <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-inner">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                    <button
                      onClick={captureAndAnalyze}
                      disabled={isProcessing}
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2 group disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                      {isProcessing ? (
                        <RefreshCw className="animate-spin" />
                      ) : (
                        <Camera size={20} className="group-hover:rotate-12 transition-transform" />
                      )}
                      {isProcessing ? 'Analyzing...' : 'Scan Frame'}
                    </button>
                    <button
                      onClick={() => {
                        stream.getTracks().forEach(track => track.stop());
                        setStream(null);
                      }}
                      className="bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-4 py-3 rounded-xl font-medium border border-white/5 hover:border-red-500/30 transition-all"
                    >
                      Stop Stream
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col animate-in fade-in zoom-in duration-500">
                  <FileUpload onFileSelect={analyzeFile} isAnalyzing={isProcessing} />

                  <div className="mt-8 flex items-center justify-center gap-4 opacity-50">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                    <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">System Input Options</span>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={startScreenShare}
                      className="group px-8 py-4 bg-white/5 hover:bg-brand-primary/10 hover:border-brand-primary/50 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-3 shadow-lg hover:shadow-brand-primary/10"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <Camera size={20} />
                      </div>
                      <span className="font-medium">Connect ERP Screen Share</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="glass-panel p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 border-l-4 border-l-brand-accent">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3 text-glow">
                  <Sparkles size={20} className="text-brand-accent" />
                  Vision Analysis Result
                </h3>
                {analysisResult.status === 'WARNING' ? (
                  <span className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <AlertTriangle size={14} /> MISMATCH DETECTED
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 size={14} /> COMPLIANCE PASSED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                  <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wider">Declared HS Code</div>
                  <div className="text-2xl font-mono font-bold text-white group-hover:text-brand-primary transition-colors">{analysisResult.declared_hs_code || '---'}</div>
                </div>
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                  <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wider">Origin Country</div>
                  <div className="text-2xl font-mono font-bold text-white group-hover:text-brand-primary transition-colors">{analysisResult.origin_country || '---'}</div>
                </div>
                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-brand-primary/30 transition-colors">
                  <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-wider">Declared Value</div>
                  <div className="text-2xl font-mono font-bold text-white group-hover:text-brand-primary transition-colors">{analysisResult.total_value ? `$${analysisResult.total_value}` : '---'}</div>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-xs text-slate-500 font-mono mb-3 uppercase tracking-wider">Cargo Description</div>
                <p className="text-base text-slate-200 leading-relaxed font-light font-sans">{analysisResult.description}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Status & Logs (4 cols) */}
        <div className="col-span-4 flex flex-col gap-6 h-full">
          <StatusPanel
            status={status === 'DANGER' ? 'DANGER' : status === 'ANALYZING' ? 'ANALYZING' : 'SAFE'}
            message={status === 'DANGER'
              ? "CRITICAL: Mismatch detected between visual description and declared HS Code. Potential Section 301 violation."
              : status === 'ANALYZING'
                ? "Agent is reading document structure and cross-referencing USITC HTS Database..."
                : "System Ready. Waiting for document input."
            }
          />

          <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col">
            <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-brand-primary" />
                <span className="text-xs font-bold text-white tracking-widest">AGENT TERMINAL</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>
            <div className="flex-1 bg-[#050505]/80 p-6 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-3 custom-scrollbar backdrop-blur-xl">
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 opacity-50">
                  <Terminal size={32} />
                  <span className="italic">Waiting for agent activity...</span>
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 border-l-2 pl-3 animate-in fade-in slide-in-from-left-2 duration-300
                            ${log.includes('Error') ? 'border-red-500/50' : 'border-brand-primary/30'}
                        `}>
                  <span className="text-slate-600 shrink-0 font-bold">{log.split(']')[0]}]</span>
                  <span className={log.includes('Error') ? 'text-red-400' : 'text-slate-300'}>{log.split(']')[1]}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default App;
