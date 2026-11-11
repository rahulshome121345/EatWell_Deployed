import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity, CheckCircle2, Info, RefreshCw, Brain, ChevronDown, Lightbulb, BookOpen } from 'lucide-react';

import { analyzeSymptomsWithGemini, type AnalysisResult } from '../../lib/gemini';
import { LearnMoreModal } from '../../components/LearnMoreModal';
import { usePersistentState } from '../../hooks/usePersistentState';

const SYMPTOMS_LIST = [
    "Fatigue", "Headache", "Nausea", "Dizziness", "Insomnia",
    "Muscle Cramps", "Dry Skin", "Hair Loss", "Brittle Nails",
    "Joint Pain", "Digestive Issues", "Mood Swings", "Cold Hands/Feet",
    "Brain Fog", "Sugar Cravings", "Pale Skin"
];

export const SymptomChecker: React.FC = () => {
    // Use persistent state for user inputs and results so they survive navigation
    const [selectedSymptoms, setSelectedSymptoms] = usePersistentState<string[]>("user_symptoms", []);
    const [customSymptom, setCustomSymptom] = usePersistentState<string>("user_custom_symptom", "");

    // UI states (loading/error) don't need to persist
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Persist the expensive analysis result
    const [result, setResult] = usePersistentState<AnalysisResult | null>("user_analysis_result", null);

    const [error, setError] = useState<string | null>(null);
    const [showReasoning, setShowReasoning] = useState(false);
    const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

    const handleLearnMore = () => {
        setShowLearnMoreModal(true);
    };

    const handleCheckAnother = () => {
        reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleSymptom = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleAnalyze = async () => {
        if (selectedSymptoms.length === 0 && !customSymptom.trim()) return;
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // Combine selected tags with custom text
            const allSymptoms = [...selectedSymptoms];
            if (customSymptom.trim()) {
                allSymptoms.push(`User Description: "${customSymptom.trim()}"`);
            }

            const data = await analyzeSymptomsWithGemini(allSymptoms);
            setResult(data);
        } catch (err) {
            setError("Secure Connection Failed. The Health Intelligence grid is currently unreachable. Please verify your connection.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setSelectedSymptoms([]);
        setCustomSymptom("");
        setResult(null);
        setError(null);
        setShowReasoning(false);
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full mb-4 border border-purple-500/20">
                        <Brain size={18} className="text-purple-400" />
                        <span className="text-sm font-medium text-purple-200">Powered by Health Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Health</span>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Intelligence</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Select your current symptoms to let our AI cross-reference potential nutritional deficiencies and wellness checks.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0B0F19] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                            {/* Subtle Medical Radial Gradient */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20 opacity-40" />

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-teal-500/10 rounded-lg">
                                    <Activity className="text-teal-400" size={20} />
                                </div>
                                <span className="text-slate-200 tracking-wide">
                                    Symptom Analysis
                                </span>
                            </h3>

                            <div className="relative mb-8 group/input">
                                <textarea
                                    value={customSymptom}
                                    onChange={(e) => setCustomSymptom(e.target.value)}
                                    placeholder="Describe your symptoms..."
                                    className="relative w-full bg-slate-950/50 border border-white/5 rounded-2xl p-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/10 focus:bg-slate-950/80 min-h-[140px] resize-none transition-all duration-300 text-base leading-relaxed shadow-inner hover:border-indigo-500/20"
                                />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Common Indicators</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {SYMPTOMS_LIST.map(symptom => (
                                    <button
                                        key={symptom}
                                        onClick={() => toggleSymptom(symptom)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${selectedSymptoms.includes(symptom)
                                            ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 shadow-sm'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300 hover:border-slate-700 hover:shadow-sm'
                                            }`}
                                    >
                                        {symptom}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={(selectedSymptoms.length === 0 && !customSymptom.trim()) || isAnalyzing}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all relative overflow-hidden ${(selectedSymptoms.length > 0 || customSymptom.trim()) && !isAnalyzing
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 border border-teal-400/20'
                                    : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-800'
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <RefreshCw className="animate-spin text-white opacity-90" />
                                        Processing Vitals...
                                    </>
                                ) : (
                                    <>
                                        Run Clinical Analysis
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center"
                                >
                                    <AlertTriangle className="mx-auto text-red-400 mb-2" size={32} />
                                    <p className="text-red-200">{error}</p>
                                    <button onClick={handleAnalyze} className="mt-4 text-sm text-red-300 underline">Try Again</button>
                                </motion.div>
                            )}

                            {!result && !isAnalyzing && !error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-white/5"
                                >
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Brain size={40} className="text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-300 mb-2">Ready for Analysis</h3>
                                    <p className="text-gray-500">Select symptoms and tap Analyze to generate report.</p>
                                </motion.div>
                            )}

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#0B0F19] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                                >
                                    {/* Decorative glow */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{result.condition}</h2>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${result.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                        result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                                            'bg-green-500/20 text-green-400 border border-green-500/20'
                                                        }`}>
                                                        {result.severity} Severity
                                                    </span>
                                                    {result.deficiency && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                                            Poss. Deficiency: {result.deficiency}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                                <CheckCircle2 className="text-green-400" size={24} />
                                            </div>
                                        </div>

                                        {/* Premium AI Reasoning Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="mb-6 relative"
                                        >
                                            {/* Collapsible Button */}
                                            <button
                                                onClick={() => setShowReasoning(!showReasoning)}
                                                className="w-full group relative overflow-hidden"
                                            >
                                                {/* Ambient Glow Background */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                                {/* Main Button Card */}
                                                <div className="relative bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 transition-all duration-300 group-hover:border-teal-500/30 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {/* Animated Brain Icon with Glow */}
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-md animate-pulse" />
                                                                <div className="relative w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                                    <Brain
                                                                        className="text-teal-400 group-hover:text-teal-300 transition-colors duration-300"
                                                                        size={20}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Text with Gradient */}
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-200 transition-colors">
                                                                    Why am I seeing this?
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    Understand the AI's reasoning
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Animated Chevron */}
                                                        <motion.div
                                                            animate={{ rotate: showReasoning ? 180 : 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            <ChevronDown
                                                                className="text-slate-500 group-hover:text-teal-400 transition-colors"
                                                                size={20}
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Expandable Content */}
                                            <AnimatePresence>
                                                {showReasoning && result.reasoning && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-3 relative">
                                                            {/* Decorative floating particles */}
                                                            <div className="absolute top-4 left-4 w-2 h-2 bg-teal-400/20 rounded-full blur-sm animate-pulse" />
                                                            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-emerald-400/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
                                                            <div className="absolute bottom-6 left-12 w-1 h-1 bg-slate-400/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />

                                                            {/* Main Content Card with Glassmorphism */}
                                                            <div className="relative bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-inner">
                                                                {/* Gradient Border Effect */}
                                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-800 to-teal-500/10 blur-[1px] -z-10" />

                                                                {/* Header */}
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <Lightbulb className="text-amber-400" size={18} />
                                                                    <h5 className="text-sm font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                                                                        AI Reasoning
                                                                    </h5>
                                                                </div>

                                                                {/* Reasoning Text */}
                                                                <motion.p
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.1, duration: 0.5 }}
                                                                    className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed mb-4"
                                                                >
                                                                    {result.reasoning}
                                                                </motion.p>

                                                                {/* Disclaimer Badge */}
                                                                <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                                                    <Info className="text-orange-400 shrink-0" size={14} />
                                                                    <span className="text-xs text-orange-300/90 italic">
                                                                        This is pattern analysis, not a medical diagnosis
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                                                    <Activity size={18} className="text-teal-400" />
                                                    AI Assessment & Action Plan
                                                </h4>

                                                <div className="grid gap-4">
                                                    {result.recommendations.map((rec, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                                                        >
                                                            <h5 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                                <span className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center text-xs text-teal-400 border border-teal-500/20">
                                                                    {index + 1}
                                                                </span>
                                                                {rec.title}
                                                            </h5>
                                                            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed pl-8">
                                                                {rec.detail}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3 items-start">
                                                <Info className="text-blue-400 shrink-0 mt-1" size={18} />
                                                <p className="text-sm text-blue-700 dark:text-blue-200/80 leading-relaxed">
                                                    {result.disclaimer}
                                                </p>
                                            </div>

                                            {/* Premium Gentle Next Steps CTAs */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                                                className="mt-6"
                                            >
                                                {/* Section Header */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Lightbulb className="text-amber-400" size={16} />
                                                    <h6 className="text-sm font-medium text-gray-400">
                                                        What's Next?
                                                    </h6>
                                                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-transparent" />
                                                </div>

                                                {/* CTA Buttons Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* CTA 1: Learn More */}
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5, duration: 0.3 }}
                                                        onClick={handleLearnMore}
                                                        className="group p-4 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl 
                                                                 hover:bg-white/80 dark:hover:bg-white/8 hover:border-purple-400/20 hover:-translate-y-0.5
                                                                 active:scale-[0.98]
                                                                 transition-all duration-300 text-left
                                                                 hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)]"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <BookOpen
                                                                    className="text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors"
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-slate-800 dark:text-gray-300 mb-1">
                                                                    Learn More About This
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-gray-500">
                                                                    Expert nutrition tips & advice
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                    <motion.button
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.6, duration: 0.3 }}
                                                        onClick={handleCheckAnother}
                                                        className="group p-4 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl 
                                                                 hover:bg-white/80 dark:hover:bg-white/8 hover:border-purple-400/20 hover:-translate-y-0.5
                                                                 active:scale-[0.98]
                                                                 transition-all duration-300 text-left
                                                                 hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)]"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <RefreshCw
                                                                    className="text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors"
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-slate-800 dark:text-gray-300 mb-1">
                                                                    Analyze Different Symptoms
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-gray-500">
                                                                    Track multiple health concerns
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                </div>
                                            </motion.div>

                                            <button
                                                onClick={reset}
                                                className="w-full py-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                <RefreshCw size={16} />
                                                Start New Analysis
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Learn More Modal */}
                {showLearnMoreModal && result && (
                    <LearnMoreModal
                        condition={result.condition}
                        symptoms={selectedSymptoms}
                        deficiency={result.deficiency}
                        onClose={() => setShowLearnMoreModal(false)}
                    />
                )}
            </div>
        </div>
    );
};
