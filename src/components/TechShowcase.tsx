import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { AnimationContainer } from './AnimationContainer';
import { Scan, Microscope } from 'lucide-react';

const WrapperProgress = ({ progress, className }: { progress: MotionValue<number>, className: string }) => {
    const [val, setVal] = useState(0);
    // Subscribe to motion value changes
    useEffect(() => {
        const unsubscribe = progress.on('change', (v) => {
            setVal(v);
        });
        return () => unsubscribe();
    }, [progress]);

    return <AnimationContainer className={className} autoPlay={false} progress={val} />;
};


export const TechShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // We want the animation to scrub from 0 to 1 over a specific range
    // Let's say we pin the section for screen height * 2

    // Map scroll progress to animation frames
    // Adjust these inputs [start, end] based on when you want the animation to run relative to the viewport
    const animProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 0.99]);

    // Overlay Opacities
    const opacity1 = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55], [0, 1, 0]);
    // Extend the final opacity to stay visible longer, then fade out with the container
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.9], [0, 1, 0]);

    // Global Container Fade Out at the end to avoid "blunt" cut
    const containerOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

    return (
        <section ref={sectionRef} className="relative h-[300vh] bg-dark">
            <motion.div style={{ opacity: containerOpacity }} className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">


                {/* Background Tech Details */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-10 left-10 p-4 border border-primary-500/30 rounded-lg">
                        <Scan className="text-primary-500 mb-2" />
                        <div className="h-1 w-20 bg-primary-500/20 rounded mb-1" />
                        <div className="h-1 w-12 bg-primary-500/20 rounded" />
                    </div>
                    <div className="absolute bottom-10 right-10 p-4 border border-primary-500/30 rounded-lg">
                        <Microscope className="text-secondary-500 mb-2" />
                        <div className="h-1 w-20 bg-secondary-500/20 rounded mb-1" />
                        <div className="h-1 w-12 bg-secondary-500/20 rounded" />
                    </div>
                </div>

                {/* The Sequence Animation - Full Screen */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    <WrapperProgress
                        className="w-full h-full"
                        progress={animProgress}
                    />
                    {/* Cinematic overlay gradient to ensure text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Text Overlays - Sync with animation */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">

                    {/* Stage 1: Surface Scan */}
                    <motion.div style={{ opacity: opacity1 }} className="text-center absolute z-30 px-4">
                        <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tight">
                            Surface Analysis
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg">
                            Spectral Analysis Pro maps food texture and volumetric data in milliseconds.
                        </p>
                    </motion.div>

                    {/* Stage 2: Recognition */}
                    <motion.div style={{ opacity: opacity2 }} className="text-center absolute z-30 px-4">
                        <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tight">
                            Molecular Match
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg">
                            Pattern matching against 10,000+ nutritional profiles with 98% accuracy.
                        </p>
                    </motion.div>

                    {/* Stage 3: Result */}
                    <motion.div style={{ opacity: opacity3 }} className="text-center absolute z-30 px-4">
                        <h2 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tight">
                            Nutritional Truth
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg">
                            Get the real macro breakdown. No guessing. Just science.
                        </p>
                    </motion.div>

                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                    <span className="text-xs uppercase tracking-[0.2em] text-primary-500/50 mb-2">System Active</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-primary-500/50 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
};
