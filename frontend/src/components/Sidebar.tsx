import React from 'react';
import { LayoutDashboard, FileText, Scale, Settings, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="w-72 relative z-20 flex flex-col glass-panel border-r-0 my-4 ml-4 rounded-3xl">
            <div className="h-24 flex items-center px-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg shadow-brand-primary/20 flex items-center justify-center mr-4">
                    <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <div>
                    <span className="font-bold tracking-tight text-xl text-white block">Customs Ghost</span>
                    <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">Enterprise AI</span>
                </div>
            </div>

            <nav className="px-4 py-6 space-y-2 flex-1">
                <div className="group flex items-center gap-4 px-6 py-4 bg-brand-primary/10 text-brand-primary rounded-2xl border border-brand-primary/20 text-sm font-semibold cursor-pointer shadow-lg shadow-brand-primary/5 transition-all">
                    <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></div>
                </div>

                {['Invoices', 'Rules Engine', 'Settings'].map((item, i) => (
                    <div key={item} className="group flex items-center gap-4 px-6 py-4 text-slate-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all text-sm font-medium cursor-pointer">
                        {i === 0 ? <FileText size={20} className="group-hover:text-brand-accent transition-colors" /> :
                            i === 1 ? <Scale size={20} className="group-hover:text-pink-500 transition-colors" /> :
                                <Settings size={20} className="group-hover:text-white transition-colors" />}
                        <span>{item}</span>
                    </div>
                ))}
            </nav>

            <div className="p-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent to-blue-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-surface-dark"></div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-surface-dark"></div>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Compliance Officer</div>
                            <div className="text-[10px] text-slate-400 font-mono">US-EAST-1 • STATIC IP</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
