import React, { useEffect, useState } from 'react';

const AutonomousCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [clicking, setClicking] = useState(false);

    useEffect(() => {
        // Simulate random "agent-like" movement
        const interval = setInterval(() => {
            const newX = 20 + Math.random() * 60; // Keep within central area
            const newY = 20 + Math.random() * 60;

            setPosition({ x: newX, y: newY });

            // Random click effect
            if (Math.random() > 0.7) {
                setClicking(true);
                setTimeout(() => setClicking(false), 200);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        >
            <div className={`relative ${clicking ? 'scale-90' : 'scale-100'} transition-transform`}>
                {/* Cursor SVG */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-xl"
                >
                    <path
                        d="M5.5 3.5L19 10L11.5 12.5L16.5 20.5L14.5 21.5L9.5 13.5L4.5 16.5V3.5Z"
                        fill="#8B5CF6" // Violet-500
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Label */}
                <div className="absolute top-6 left-4 bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full font-mono whitespace-nowrap opacity-90">
                    Agent Active
                </div>

                {/* Click Ripple */}
                {clicking && (
                    <div className="absolute top-0 left-0 w-8 h-8 bg-violet-400 rounded-full animate-ping opacity-75"></div>
                )}
            </div>
        </div>
    );
};

export default AutonomousCursor;
