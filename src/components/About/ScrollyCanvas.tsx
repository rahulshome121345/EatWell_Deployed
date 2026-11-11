import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';

interface ScrollyCanvasProps {
    numFrames: number;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({ numFrames, scrollRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [layoutVersion, setLayoutVersion] = useState(0);
    const [loadProgress, setLoadProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    // Add smooth physics (damping/mass) to the scroll value
    // This creates the "buttery" delay/momentum effect
    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20,
        restDelta: 0.001
    });

    // Preload Images (Parallel)
    useEffect(() => {
        const loadImages = async () => {
            const promises = [];

            for (let i = 0; i < numFrames; i++) {
                const padIndex = String(i).padStart(3, '0');
                const src = `/sequences/frame_${padIndex}.png`;

                const promise = new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        resolve(img);
                        setLoadProgress((prev) => Math.min(prev + (100 / numFrames), 100));
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve(img);
                        setLoadProgress((prev) => Math.min(prev + (100 / numFrames), 100));
                    };
                });

                promises.push(promise);
            }

            try {
                // Update progress based on settled promises if needed, 
                // but for speed we just wait for all. 
                // To show progress, we'd need a different approach, but let's prioritize speed first.
                const loadedImages = await Promise.all(promises);
                console.log(`Loaded ${loadedImages.length} frames`);

                setImages(loadedImages);
                setIsLoaded(true);
            } catch (err) {
                console.error("Error loading sequence:", err);
            }
        };

        loadImages();
    }, [numFrames]);

    // Draw Loop linked to Smooth Progress
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        const render = (progress: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (canvas && ctx) {
                // Map smooth progress to frame index
                // STRICT CLAMPING: Ensure we never go below 0 or above length-1
                let frameIndex = Math.floor(progress * (images.length - 1));
                frameIndex = Math.max(0, Math.min(frameIndex, images.length - 1));

                const img = images[frameIndex];

                // Redundancy check - should not happen with clamping, but good for safety
                if (!img) {
                    // Fallback to last valid frame if possible, or just return
                    return;
                }

                // Responsive "Object-Fit: Cover" Logic
                const dpr = window.devicePixelRatio || 1;
                // Only resize if dimensions differ to avoid clearing canvas unnecessarily on high freq calls
                // But for scroll sync, we usually just overwrite.

                if (canvas.width !== canvas.clientWidth * dpr || canvas.height !== canvas.clientHeight * dpr) {
                    canvas.width = canvas.clientWidth * dpr;
                    canvas.height = canvas.clientHeight * dpr;
                    ctx.scale(dpr, dpr);
                } else {
                    // Reset transform if not resizing, or just clear.
                    // A simple clear is safer if we are not resizing every frame.
                    // But we need to ensure scale is correct. 
                    // Simplest robust way: set width/height every time or restore context.
                    // Actually, setting width/height clears canvas, which is fine for full redraw.
                    canvas.width = canvas.clientWidth * dpr;
                    canvas.height = canvas.clientHeight * dpr;
                    ctx.scale(dpr, dpr);
                }

                // High-quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                const parentW = canvas.clientWidth;
                const parentH = canvas.clientHeight;
                const imgRatio = img.width / img.height;
                const parentRatio = parentW / parentH;

                let drawW, drawH, offsetX, offsetY;

                if (parentRatio > imgRatio) {
                    drawW = parentW;
                    drawH = drawW / imgRatio;
                    offsetX = 0;
                    // Bias vertical alignment to the top (20%) instead of center (50%) 
                    // to ensure head/hair is visible and not cropped or hidden behind navbar
                    offsetY = (parentH - drawH) * 0.2;
                } else {
                    drawH = parentH;
                    drawW = drawH * imgRatio;
                    offsetX = (parentW - drawW) / 2;
                    offsetY = 0;
                }

                ctx.clearRect(0, 0, parentW, parentH);
                ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
            }
        };

        // Subscribe to SMOOTH progress changes
        const unsubscribe = smoothProgress.on("change", (latest: number) => {
            requestAnimationFrame(() => render(latest));
        });

        // Initial render forces frame 0 immediately when loaded
        render(smoothProgress.get());

        return () => unsubscribe();
    }, [isLoaded, images, smoothProgress, layoutVersion]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            // Force re-render/re-setup of the draw loop with new layout
            setLayoutVersion(v => v + 1);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0 bg-black">
            <div
                className={`absolute inset-0 flex items-center justify-center text-white/50 bg-black z-20 transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <div className="text-center">
                    <div className="mb-2 text-xs uppercase tracking-widest text-primary/80">Initializing Experience</div>
                    <div className="h-0.5 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${loadProgress}%` }} />
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Cinematic Overlay - Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/50 pointer-events-none" />
        </div>
    );
};
