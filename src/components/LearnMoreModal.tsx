import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Share2, Sparkles, ChevronDown, Lightbulb, ExternalLink } from 'lucide-react';
import { generateNutritionInsights, type PersonalizedInsights } from '../lib/gemini';
import { getArticles, type Article } from '../lib/db';
import { findMatchingArticle } from '../lib/contentMatcher';

interface LearnMoreModalProps {
    condition: string;
    symptoms: string[];
    deficiency?: string;
    onClose: () => void;
}

interface BookmarkItem {
    condition: string;
    symptoms: string[];
    deficiency?: string;
    timestamp: number;
    type: string;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({
    condition,
    symptoms,
    deficiency,
    onClose
}) => {
    const [insights, setInsights] = useState<PersonalizedInsights | null>(null);
    const [matchedArticle, setMatchedArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Feedback State
    // Feedback State
    const [feedbackGiven, setFeedbackGiven] = useState<'thumbsUp' | 'thumbsDown' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadContent = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Load both AI insights and check for expert articles
            const [aiInsights, articles] = await Promise.all([
                generateNutritionInsights(condition, symptoms, deficiency),
                getArticles()
            ]);

            setInsights(aiInsights);

            // Try to find matching expert article
            const match = findMatchingArticle(condition, symptoms, articles);
            if (match && match.confidence >= 40) {
                setMatchedArticle(match.article);
            }

            // Check bookmark status
            const bookmarks = JSON.parse(localStorage.getItem('eatwell_bookmarks') || '[]');
            const isSaved = bookmarks.some((b: BookmarkItem) => b.condition === condition && b.timestamp);
            // Simple duplication check based on condition for now, can be improved
            setIsBookmarked(isSaved);

        } catch (error) {
            console.error('Failed to load Learn More content:', error);
            setError('Unable to generate insights at this time. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [condition, symptoms, deficiency]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    const toggleInsight = (index: number) => {
        const newExpanded = new Set(expandedInsights);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedInsights(newExpanded);
    };

    const handleShare = async () => {
        const shareData = {
            title: `Health Insights for ${condition}`,
            text: `I found some interesting health insights regarding ${condition} on EatWell.`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
            // You might want to show a toast here, but for now we'll just log
            alert('Link copied to clipboard!');
        }
    };

    const handleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('eatwell_bookmarks') || '[]');

        if (isBookmarked) {
            // Remove
            const newBookmarks = bookmarks.filter((b: BookmarkItem) => b.condition !== condition);
            localStorage.setItem('eatwell_bookmarks', JSON.stringify(newBookmarks));
            setIsBookmarked(false);
        } else {
            // Add
            const newBookmark = {
                condition,
                symptoms,
                deficiency,
                timestamp: Date.now(),
                type: 'insight'
            };
            bookmarks.push(newBookmark);
            localStorage.setItem('eatwell_bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    };

    const handleFeedback = (type: 'thumbsUp' | 'thumbsDown') => {
        setFeedbackGiven(type);
        // Here you would typically send this analytics data to your backend
        console.log(`User feedback for ${condition}: ${type}`);

        // Save to local storage to persist user's choice temporarily if needed
        const feedback = JSON.parse(localStorage.getItem('eatwell_feedback') || '{}');
        feedback[condition] = type;
        localStorage.setItem('eatwell_feedback', JSON.stringify(feedback));
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'diet': return '🥗';
            case 'hydration': return '💧';
            case 'timing': return '⏰';
            case 'supplement': return '💊';
            case 'lifestyle': return '🏃';
            default: return '✨';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 40, stiffness: 300 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-[#0B0F19] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-t border-white/10"
                >
                    {/* Luminescence: Aurora Gradients */}
                    <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                    {/* Header: Floating Glass */}
                    <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-[#0B0F19]/60 backdrop-blur-xl">
                        <div className="flex-1">
                            <h2 className="text-3xl font-light text-white mb-3 tracking-wide font-serif">Wellness Insights</h2>
                            <div className="flex flex-wrap gap-2">
                                {symptoms.slice(0, 3).map((symptom, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs font-medium text-slate-300 tracking-wider uppercase"
                                    >
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-3 hover:bg-white/5 rounded-full transition-colors group relative"
                                onClick={handleShare}
                                aria-label="Share"
                            >
                                <Share2 size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                            <button
                                className={`p-3 rounded-full transition-colors group relative ${isBookmarked ? 'bg-teal-500/10 text-teal-400' : 'hover:bg-white/5 text-slate-500'}`}
                                onClick={handleBookmark}
                                aria-label="Bookmark"
                            >
                                <Bookmark size={18} className={`${isBookmarked ? 'fill-current' : 'group-hover:text-white'} transition-colors`} />
                            </button>
                            <button
                                className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 group hover:rotate-90 bg-white/5"
                                onClick={onClose}
                            >
                                <X size={20} className="text-slate-400 group-hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-2 border-slate-700 border-t-teal-500 rounded-full animate-spin" />
                                    <p className="text-slate-400 text-sm font-medium">Analyzing health data...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                    <X size={24} className="text-red-400" />
                                </div>
                                <h3 className="text-slate-200 font-medium mb-2">Analysis Failed</h3>
                                <p className="text-slate-400 text-sm max-w-xs mb-6">{error}</p>
                                <button
                                    onClick={loadContent}
                                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Expert Article Section (if available) */}
                                {matchedArticle && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative"
                                    >
                                        {/* Editorial Card Design */}
                                        <div className="relative group bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-md border-t border-l border-white/10 rounded-2xl p-8 transition-all duration-700 hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ opacity: [1, 0.5, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                                                    />
                                                    <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">
                                                        Expert Verified
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-3xl font-serif font-light text-white mb-4 tracking-wide group-hover:text-amber-50 transition-colors duration-500 leading-tight">
                                                {matchedArticle.title}
                                            </h3>

                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="h-px w-8 bg-amber-500/30" />
                                                <div className="text-sm text-slate-400">
                                                    <span className="font-medium text-slate-200">{matchedArticle.author.name}</span>
                                                    <span className="text-slate-500 mx-2">•</span>
                                                    <span className="text-slate-500">{matchedArticle.author.credentials}</span>
                                                </div>
                                            </div>

                                            <p className="text-slate-300 text-lg font-light leading-relaxed mb-8 line-clamp-3 opacity-90">
                                                {matchedArticle.excerpt}
                                            </p>

                                            <motion.a
                                                href={`/blog/${matchedArticle.slug}`}
                                                whileHover={{ x: 5 }}
                                                className="inline-flex items-center gap-3 text-amber-500 hover:text-amber-400 font-medium tracking-wide group/link"
                                            >
                                                Read Full Article
                                                <ExternalLink size={16} className="opacity-70 group-hover/link:translate-x-1 transition-transform" />
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                )}

                                {/* AI Insights Section */}
                                {insights && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: matchedArticle ? 0.2 : 0 }}
                                    >
                                        {/* Section Header */}
                                        <div className="flex items-center gap-3 mb-5">
                                            {!matchedArticle && (
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                    <Sparkles className="text-indigo-400" size={16} />
                                                </div>
                                            )}
                                            <h4 className="text-lg font-medium text-slate-200">
                                                {matchedArticle ? 'Additional Insights' : 'AI Analysis & Suggestions'}
                                            </h4>
                                        </div>

                                        {/* Quick Summary */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 mb-6 relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                            <p className="text-slate-300 text-sm leading-relaxed relative z-10 font-light tracking-wide">
                                                {insights.quickSummary}
                                            </p>
                                        </motion.div>

                                        {/* Insights Cards */}
                                        <div className="space-y-4">
                                            {insights.insights.map((insight, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + 0.3 }}
                                                    className="group"
                                                >
                                                    <button
                                                        onClick={() => toggleInsight(index)}
                                                        className="w-full text-left bg-gradient-to-r from-white/[0.03] to-transparent hover:from-white/[0.06] border-l-2 border-transparent hover:border-indigo-400/50 rounded-r-xl p-5 transition-all duration-300 group-hover:translate-x-1"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-6 flex-1">
                                                                <div className="text-2xl p-3 bg-white/[0.03] rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner ring-1 ring-white/5">
                                                                    {getCategoryIcon(insight.category)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium text-slate-200 mb-1 group-hover:text-indigo-200 transition-colors text-lg tracking-wide">{insight.title}</h5>
                                                                    {!expandedInsights.has(index) && (
                                                                        <p className="text-sm text-slate-500 font-light line-clamp-1 group-hover:text-slate-400 transition-colors">
                                                                            {insight.detail.split('.')[0]}...
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <motion.div
                                                                animate={{ rotate: expandedInsights.has(index) ? 180 : 0 }}
                                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"
                                                            >
                                                                <ChevronDown size={14} className="text-slate-500 group-hover:text-white" />
                                                            </motion.div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {expandedInsights.has(index) && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.4, ease: "circOut" }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                                        <p className="text-base text-slate-300 font-light leading-relaxed pl-[72px] pr-4 opacity-90">
                                                                            {insight.detail}
                                                                        </p>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Scientific Basis */}
                                        {/* Scientific Basis & Timeline Grid */}
                                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white/[0.02] border-t border-white/5 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                        <Lightbulb size={14} className="text-indigo-400" />
                                                    </div>
                                                    <h5 className="font-medium text-slate-200 text-sm tracking-wide">Scientific Basis</h5>
                                                </div>
                                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                                    {insights.scientificBasis}
                                                </p>
                                            </div>

                                            <div className="bg-white/[0.02] border-t border-white/5 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                                        <span className="text-emerald-500 text-sm">⏱️</span>
                                                    </div>
                                                    <h5 className="font-medium text-slate-200 text-sm tracking-wide">Expected Timeline</h5>
                                                </div>
                                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                                    {insights.timelineExpectation}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Feedback Section */}
                                        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center">
                                            <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-wider">Was this helpful?</p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleFeedback('thumbsUp')}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${feedbackGiven === 'thumbsUp' ? 'bg-teal-500/20 text-teal-400 scale-110 ring-1 ring-teal-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                                                >
                                                    <span className="text-xl">👍</span>
                                                </button>
                                                <button
                                                    onClick={() => handleFeedback('thumbsDown')}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${feedbackGiven === 'thumbsDown' ? 'bg-rose-500/20 text-rose-400 scale-110 ring-1 ring-rose-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                                                >
                                                    <span className="text-xl">👎</span>
                                                </button>
                                            </div>
                                            {feedbackGiven && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-[10px] text-teal-500/80 mt-3 font-medium tracking-wide"
                                                >
                                                    THANK YOU FOR YOUR FEEDBACK
                                                </motion.span>
                                            )}
                                        </div>

                                        {/* Disclaimer */}
                                        {!matchedArticle && (
                                            <div className="mt-8 text-[10px] text-slate-600 text-center max-w-lg mx-auto leading-relaxed">
                                                Content generated by AI based on general nutritional parameters. This is for informational purposes only and does not constitute medical advice.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
