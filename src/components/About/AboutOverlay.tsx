import React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface AboutOverlayProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const AboutOverlay: React.FC<AboutOverlayProps> = ({ scrollRef }) => {
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    // Act 1: Identity (Center)
    // 5% -> 15% Fade In, Stay till 30%, Fade Out by 35%
    // GAP: 35% - 38%
    const opacity1 = useTransform(scrollYProgress, [0.05, 0.15, 0.30, 0.35], [0, 1, 1, 0]);
    const scale1 = useTransform(scrollYProgress, [0.05, 0.35], [0.95, 1.05]);

    // Act 2: Vision (Left)
    // Starts at 38% (after Act 1 is gone)
    // 38% -> 48% Fade In, Stay till 63%, Fade Out by 68%
    // GAP: 68% - 71%
    const opacity2 = useTransform(scrollYProgress, [0.38, 0.48, 0.63, 0.68], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.38, 0.68], [40, 0]);

    // Act 3: Methods (Right)
    // Starts at 71% (after Act 2 is gone)
    // 71% -> 81% Fade In, Stay till 95%, Fade Out by 99%
    const opacity3 = useTransform(scrollYProgress, [0.71, 0.81, 0.95, 0.99], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.71, 0.95], [40, 0]);

    return (
        <div className="relative z-50 pointer-events-none">

            {/* Slide 1: Identity (Center) - "Sameer." style */}
            <motion.div
                style={{ opacity: opacity1, scale: scale1 }}
                className="fixed inset-0 flex flex-col items-center justify-center text-center p-4"
            >
                <div>
                    <h1 className="text-[12vw] md:text-[9rem] font-[900] tracking-tighter leading-[0.8] text-white drop-shadow-2xl font-inter">
                        Arunima<span className="text-primary-500">.</span>
                    </h1>
                    <p className="mt-4 text-xl md:text-3xl font-medium tracking-[0.2em] text-gray-300 uppercase">
                        Nutritionist & PhD
                    </p>
                </div>
            </motion.div>

            {/* Slide 2: Research (Left) */}
            <motion.div
                style={{ opacity: opacity2, x: y2 }} // Using x for horizontal motion with the 'y2' value name for minimal diff, or rename var. Let's just use the style.
                className="fixed inset-0 flex items-center justify-start px-8 md:px-24"
            >
                <div className="max-w-4xl">
                    <h2 className="text-[8vw] md:text-[6rem] font-[800] tracking-tight leading-[0.9] text-white">
                        Translating <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            complex science.
                        </span>
                    </h2>
                </div>
            </motion.div>

            {/* Slide 3: Vision (Right) */}
            <motion.div
                style={{ opacity: opacity3, x: y3 }} // Using x for horizontal motion? No, y3 was vertical. Let's keep vertical for now or switch to horizontal? Reference had simple fade/slide. Let's stick to simple fade/slide. 
                className="fixed inset-0 flex items-center justify-end px-8 md:px-24"
            >
                <div className="text-right max-w-4xl">
                    <h2 className="text-[8vw] md:text-[6rem] font-[800] tracking-tight leading-[0.9] text-white">
                        Evidence-based <br />
                        <span className="text-primary-400">wellness.</span>
                    </h2>
                </div>
            </motion.div>
        </div>
    );
};
