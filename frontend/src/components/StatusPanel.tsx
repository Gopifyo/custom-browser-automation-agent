import React from 'react';
import { ShieldCheck, AlertOctagon, Activity, Lock } from 'lucide-react';

interface StatusPanelProps {
    status: 'SAFE' | 'DANGER' | 'ANALYZING';
    message: string;
}

const StatusPanel = ({ status, message }: StatusPanelProps) => {
    return (
        <div className={`glass-card p-1 rounded-3xl overflow-hidden relative group transition-all duration-500
      ${status === 'DANGER' ? 'shadow-[0_0_50px_rgba(239,68,68,0.2)]' : ''}
    `}>
            {/* Animated Border Gradient */}
            <div className={`absolute inset-0 opacity-20 animate-pulse
            ${status === 'DANGER' ? 'bg-gradient-to-br from-red-600 to-orange-600' :
                    status === 'ANALYZING' ? 'bg-gradient-to-br from-brand-primary to-brand-accent' :
                        'bg-gradient-to-br from-green-500 to-emerald-600'}
        `}></div>

            <div className="relative bg-[#0B0E14] rounded-[20px] p-6 h-full border border-white/5 flex flex-col justify-between">

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">System Status</h3>
                        <div className={`text-2xl font-black tracking-tighter flex items-center gap-3
                    ${status === 'DANGER' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                status === 'ANALYZING' ? 'text-brand-accent' : 'text-green-500'}
                `}>
                            {status === 'DANGER' ? <AlertOctagon className="animate-bounce" /> :
                                status === 'ANALYZING' ? <Activity className="animate-spin-slow" /> :
                                    <ShieldCheck />}
                            {status}
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5
                ${status === 'DANGER' ? 'text-red-500' : 'text-slate-600'}
            `}>
                        <Lock size={20} />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 
                 ${status === 'DANGER' ? 'bg-red-500' :
                            status === 'ANALYZING' ? 'bg-brand-primary' : 'bg-green-500'}
            `}></div>
                    <p className="text-sm font-medium text-slate-300 pl-2 leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusPanel;
