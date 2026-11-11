import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { Link } from 'react-router-dom';
import { ScanLine, Activity, BrainCircuit, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
            {/* Hero Section */}
            <Hero />

            {/* Feature Glimpse */}
            <section className="py-24 bg-slate-50 dark:bg-dark/50 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI Vision",
                                desc: "Snap a photo of your meal. Application detects ingredients and estimates calories instantly.",
                                icon: ScanLine,
                                color: "text-cyan-400",
                                glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
                                border: "group-hover:border-cyan-500/50",
                                bg: "group-hover:bg-cyan-500/10",
                                path: "/scan"
                            },
                            {
                                title: "Smart Metrics",
                                desc: "Scientific BMR & TDEE calculators tailored to your biometric data.",
                                icon: Activity,
                                color: "text-emerald-400",
                                glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]",
                                border: "group-hover:border-emerald-500/50",
                                bg: "group-hover:bg-emerald-500/10",
                                path: "/calculator"
                            },
                            {
                                title: "Symptom Logic",
                                desc: "Feeling off? Check potential nutritional deficiencies with our rule-based engine.",
                                icon: BrainCircuit,
                                color: "text-purple-400",
                                glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                                border: "group-hover:border-purple-500/50",
                                bg: "group-hover:bg-purple-500/10",
                                path: "/symptoms"
                            }
                        ].map((feature, i) => (
                            <Link to={feature.path} key={i}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`group h-full p-8 rounded-3xl bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 ${feature.border} shadow-lg dark:shadow-none transition-all duration-300 relative overflow-hidden`}
                                >
                                    {/* Holographic Gradient Overlay */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none`} />

                                    <div className="relative z-10 space-y-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center ${feature.color} ${feature.bg} ${feature.glow} transition-all duration-300`}>
                                            <feature.icon size={28} />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-50 transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-light group-hover:text-slate-800 dark:group-hover:text-gray-300 transition-colors">
                                                {feature.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white/50 group-hover:text-slate-900 dark:group-hover:text-white transition-colors pt-2">
                                            <span>Explore Feature</span>
                                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
