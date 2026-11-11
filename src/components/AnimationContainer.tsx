import { useRef, useEffect, useState } from 'react';

interface AnimationContainerProps {
    className?: string;
    autoPlay?: boolean;
    progress?: number; // 0 to 1
}

export const AnimationContainer: React.FC<AnimationContainerProps> = ({
    className = "",
    autoPlay = true,
    ...props
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const requestRef = useRef<number | null>(null);
    const frameIndexRef = useRef(0);

    // Preload images
    useEffect(() => {
        const loadImages = async () => {



            // Vite glob import to get all exact paths
            const modules = import.meta.glob('/src/assets/sequences/*.png', { eager: true, query: '?url', import: 'default' });
            const modulePaths = Object.values(modules) as string[];
            // Sort manually because glob order isn't guaranteed
            const sortedPaths = modulePaths.sort((a, b) => {
                // Extract numbers to sort correctly frame_000 vs frame_010
                const getNum = (str: string) => parseInt(str.match(/frame_(\d+)/)?.[1] || "0");
                return getNum(a) - getNum(b);
            });

            const imageElements = await Promise.all(sortedPaths.map(path => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = path;
                    img.onload = () => resolve(img);
                });
            }));

            setImages(imageElements);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Animation Loop (AutoPlay) or External Control
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        const renderFrame = (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (canvas && ctx) {
                // Clear and draw
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const img = images[index];

                if (!img) return;

                // Draw image "cover" style
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        // If controllable via progress prop
        if (typeof props.progress === 'number') {
            const frameIndex = Math.min(
                Math.max(Math.floor(props.progress * (images.length - 1)), 0),
                images.length - 1
            );
            renderFrame(frameIndex);
            return;
        }

        // AutoPlay Logic
        if (!autoPlay) return;

        const animate = () => {
            renderFrame(frameIndexRef.current);
            // Advance frame
            frameIndexRef.current = (frameIndexRef.current + 1) % images.length;

            setTimeout(() => {
                requestRef.current = requestAnimationFrame(animate);
            }, 40); // ~25fps
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isLoaded, autoPlay, images, props.progress]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const parent = canvasRef.current.parentElement;
                if (parent) {
                    canvasRef.current.width = parent.clientWidth;
                    canvasRef.current.height = parent.clientHeight;
                }
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark text-primary animate-pulse">
                    Loading Experience...
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
            />
            {/* Overlay Gradient for integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent pointer-events-none" />
        </div>
    );
};
