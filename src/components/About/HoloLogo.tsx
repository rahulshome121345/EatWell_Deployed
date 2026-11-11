import React from 'react';

export const HoloLogo: React.FC = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
            {/* 1. Base Hologram Layer (Video) */}
            <div className="relative w-full h-full mix-blend-screen opacity-90 transition-opacity duration-500 hover:opacity-100">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/iit-logo/frame_000_delay-0.05s.gif"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(45,212,191,0.6)]"
                    style={{
                        filter: "contrast(1.3) brightness(1.2) hue-rotate(185deg) saturate(0.8)",
                    }}
                >
                    <source src="/iit-logo/holo.webm" type="video/webm" />
                    {/* Fallback for safety */}
                    <img
                        src="/iit-logo/frame_000_delay-0.05s.gif"
                        alt="IIT Guwahati Hologram"
                        className="w-full h-full object-contain"
                    />
                </video>
            </div>

            {/* 2. Shine / Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-700" />

            {/* 3. Subtle Scanline Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_3px] opacity-10 pointer-events-none" />
        </div>
    );
};
