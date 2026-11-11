import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Leaf, Carrot, Egg, ShieldCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-opal-mesh dark:bg-dark">
            {/* Background Gradients */}
            {/* Background Gradients & Premium Texture */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {/* Light Mode Specific: Warmer, richer gradients */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-teal-100/80 to-emerald-100/80 dark:from-primary-900/20 dark:to-transparent rounded-full blur-[80px] animate-pulse mix-blend-multiply dark:mix-blend-normal" />

                {/* Secondary Warm Glow for Contrast */}
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-orange-100/80 to-amber-100/80 dark:from-secondary/5 dark:to-transparent rounded-full blur-[100px] opacity-80 dark:opacity-100 mix-blend-multiply dark:mix-blend-normal" />

                {/* Center subtle lift */}
                <div className="absolute top-[30%] left-[30%] w-[800px] h-[800px] bg-indigo-50/50 dark:bg-transparent rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

                {/* Subtle Grain/Texture Overlay - Refined */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 brightness-100 contrast-150" />
            </div>

            {/* Seamless Transition Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-dark to-transparent z-20 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border border-primary/20">
                        <Sparkles size={16} className="text-primary-500" />
                        <span className="text-sm font-semibold text-gray-300 tracking-wide">AI-Powered Nutrition Intelligence</span>
                    </div>


                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                        Eat Smart. <br />
                        <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            Live Better.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg font-medium">
                        Your personal health ecosystem. Scan meals with AI, track nutritional intake, and check clinical symptoms in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link to="/scan" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-primary-600 rounded-full hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 hover:scale-105 active:scale-95">
                            <span>Start AI Analysis</span>
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/calculator" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:-translate-y-1 active:scale-95">
                            Calculate Needs
                        </Link>
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        Snap a food photo for instant nutrition analysis.
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-y-4 gap-x-6">
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-gray-400">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <span className="text-sm font-medium">Private & Secure</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-gray-400">
                            <UserCheck size={18} className="text-blue-500" />
                            <span className="text-sm font-medium">Nutritionist Reviewed</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Animation (The Whisk Bowl) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:flex items-center justify-center h-[600px]"
                >
                    {/* Floating Bowl Container */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-[340px] h-[340px] bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center"
                    >
                        {/* Inner Circle / Plate */}
                        <div className="absolute inset-4 rounded-full border border-white/10 bg-white/5" />

                        {/* Floating Ingredients - Real Food Bubbles */}
                        {/* Floating Ingredients - Real Food Bubbles */}
                        {/* Floating Ingredients - Real Food Bubbles */}
                        {/* Leaf - Top Left */}
                        <motion.div
                            animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[32%] left-[22%] bg-green-900/20 backdrop-blur-md p-4 rounded-3xl border border-green-500/20 z-10"
                        >
                            <Leaf className="w-8 h-8 text-green-500" />
                        </motion.div>

                        {/* Carrot - Top Right */}
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[28%] right-[25%] bg-orange-900/20 backdrop-blur-md p-4 rounded-3xl border border-orange-500/20 z-10"
                        >
                            <Carrot className="w-8 h-8 text-orange-500" />
                        </motion.div>

                        {/* Egg - Bottom */}
                        <motion.div
                            animate={{ x: [-5, 5, -5] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[30%] left-[38%] bg-yellow-900/20 backdrop-blur-md p-4 rounded-3xl border border-yellow-500/20 z-10"
                        >
                            <Egg className="w-8 h-8 text-yellow-500" />
                        </motion.div>

                        {/* Scanner Line */}
                        <div className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
                            <motion.div
                                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-[2px] bg-primary-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                            />
                        </div>

                        {/* Confidence Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -right-8 top-1/2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700"
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Analysis Complete</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-24 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full w-[92%] bg-primary-500 rounded-full" />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-700 dark:text-slate-300">Healthy Match</span>
                                    <span className="font-bold text-primary-600">92%</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
