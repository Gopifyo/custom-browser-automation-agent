import React from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen text-slate-300 font-sans flex overflow-hidden selection:bg-brand-primary/30 relative">
            <div className="absolute inset-0 z-0 mesh-gradient opacity-40 animate-pulse"></div>

            <div className="relative z-10 flex w-full h-screen">
                <Sidebar />
                <main className="flex-1 flex flex-col relative overflow-hidden">
                    {children}
                </main>
                <Toaster position="top-right" theme="dark" />
            </div>
        </div>
    );
};

export default Layout;
