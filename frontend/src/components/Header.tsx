import React from 'react';
import { Wifi, Eye, Activity } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-24 flex items-center justify-between px-8 z-20">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Activity className="text-brand-accent animate-pulse" />
                    <span className="text-glow">Active Audit Session</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-500">ID:</span>
                    <span className="text-xs font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded">#8492-AC</span>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="glass-card flex items-center gap-3 px-4 py-2 rounded-full">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HTS Database</span>
                        <span className="text-xs font-bold text-white">CONNECTED</span>
                    </div>
                    <Wifi size={14} className="text-slate-500 ml-2" />
                </div>

                <div className="glass-card flex items-center gap-3 px-4 py-2 rounded-full border-brand-primary/20 bg-brand-primary/5">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Vision Engine</span>
                        <span className="text-xs font-bold text-white">GEMINI 2.0 FLASH</span>
                    </div>
                    <Eye size={14} className="text-brand-primary ml-2" />
                </div>
            </div>
        </header>
    );
};

export default Header;
