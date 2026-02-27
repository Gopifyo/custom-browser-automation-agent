import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, ScanLine, FileType } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setFileName(file.name);
        onFileSelect(file);
    };

    const clearFile = () => {
        setFileName(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div
            className={`relative w-full h-full min-h-[300px] rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden group
        ${dragActive
                    ? "border-brand-primary bg-brand-primary/10 scale-[1.02] shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-primary/50"}
        ${fileName && !isAnalyzing ? "border-green-500/50 bg-green-500/5" : ""}
      `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
            />

            {isAnalyzing ? (
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-brand-primary/20 flex items-center justify-center animate-pulse">
                            <ScanLine className="w-10 h-10 text-brand-primary animate-spin-slow" />
                        </div>
                        <div className="absolute inset-0 border-4 border-t-brand-primary/50 border-r-transparent border-b-brand-primary/50 border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">Analyzing Document...</h3>
                        <p className="text-sm text-brand-secondary font-mono">Extracting HS Codes & Origin Data</p>
                    </div>
                </div>
            ) : fileName ? (
                <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                        <FileType className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-white">{fileName}</p>
                        <div className="flex items-center gap-2 justify-center mt-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-xs text-green-400 font-mono">READY FOR COMPLIANCE CHECK</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); clearFile(); }}
                        className="absolute -top-6 -right-6 p-2 bg-white/10 rounded-full hover:bg-red-500 hover:text-white transition-all backdrop-blur-md"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 pointer-events-none relative z-10">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl
             ${dragActive ? "bg-brand-primary text-white rotate-12 scale-110" : "bg-gradient-to-br from-white/10 to-white/5 text-slate-400 border border-white/10"}
          `}>
                        <UploadCloud className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-glow transition-all">Upload Invoice</h3>
                        <p className="text-sm text-slate-400 max-w-[200px]">Drag & Drop PDF or Image to initiate autonomous audit</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {['PDF', 'JPG', 'PNG'].map(fmt => (
                            <span key={fmt} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-slate-500 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all">
                                {fmt}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        </div>
    );
};

export default FileUpload;
