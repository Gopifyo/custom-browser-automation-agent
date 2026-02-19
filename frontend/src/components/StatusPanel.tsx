import React from 'react';

interface StatusPanelProps {
    status: 'SAFE' | 'DANGER' | 'ANALYZING';
    message: string;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status, message }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'SAFE': return 'bg-green-500/20 border-green-500 text-green-400';
            case 'DANGER': return 'bg-red-500/20 border-red-500 text-red-400';
            default: return 'bg-blue-500/20 border-blue-500 text-blue-400';
        }
    };

    return (
        <div className={`w-full p-4 border rounded-lg backdrop-blur-md ${getStatusColor()} transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold tracking-wider font-mono">
                    {status === 'ANALYZING' ? '⚡ ANALYZING...' : `STATUS: ${status}`}
                </h2>
                {status === 'DANGER' && (
                    <span className="animate-pulse bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        ACTION REQUIRED
                    </span>
                )}
            </div>
            <p className="font-mono text-sm opacity-90">{message}</p>
        </div>
    );
};

export default StatusPanel;
