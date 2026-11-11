
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ShieldCheck, Globe, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { getArticleById, type Article } from '../lib/db';

export const ExternalSource: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (id) {
                const data = await getArticleById(id);
                if (data) {
                    setArticle(data);
                }
            }
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center text-primary">Preparing Gateway...</div>;
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-light dark:bg-dark flex flex-col items-center justify-center text-slate-900 dark:text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Resource Not Found</h2>
                <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
            </div>
        );
    }

    // Extract domain for "Source" credit
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return 'External Source';
        }
    };

    return (
        <div className="min-h-screen bg-light dark:bg-dark text-slate-900 dark:text-white relative overflow-hidden flex flex-col">

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <img
                    src={article.imageUrl}
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/50 dark:from-dark dark:via-dark/80 dark:to-dark/50" />
            </div>

            {/* Navigation Bar */}
            <div className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="font-medium">Back to Blog</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-wide uppercase">
                    <ShieldCheck size={16} />
                    Verified External Source
                </div>
            </div>

            {/* Main Content Split */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Metadata & Intro */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary-400 font-bold tracking-wider text-sm uppercase">
                                <span className="flex items-center gap-1.5"><Globe size={16} /> {getDomain(article.slug)}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="flex items-center gap-1.5"><Clock size={16} /> {article.readTime} Read</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                                {article.title}
                            </h1>
                        </div>

                        {/* The "EatWell Insight" Box */}
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:bg-white/90 dark:hover:bg-white/10 transition-colors duration-300 shadow-sm dark:shadow-none">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-500" />

                            <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                                    <BookOpen size={12} />
                                </span>
                                EatWell Insight
                            </h3>

                            <p className="text-lg text-slate-700 dark:text-gray-200 leading-relaxed italic font-light">
                                "{article.excerpt}"
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                    AD
                                </div>
                                <div className="text-xs">
                                    <p className="text-slate-900 dark:text-white font-bold">Curated by Arunima Dhar</p>
                                    <p className="text-slate-500 dark:text-gray-500">Nutrition Expert</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Cover & Action */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        {/* Image Card */}
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-slate-200 dark:border-white/10">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Floating Action Button */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
                                <a
                                    href={article.slug}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-dark py-4 rounded-xl font-bold text-lg hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-xl shadow-black/20 flex items-center justify-center gap-3 group/btn"
                                >
                                    Read Full Source
                                    <ExternalLink size={20} />
                                    <ChevronRight size={20} className="w-0 overflow-hidden group-hover/btn:w-5 transition-all duration-300" />
                                </a>
                            </div>
                        </div>

                        {/* Decorative Blob */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity -z-10" />
                    </motion.div>
                </div>
            </div>

            <div className="relative z-20 py-6 text-center text-xs text-gray-600">
                Data provided by {getDomain(article.slug)} • Accessed via EatWell Knowledge Hub
            </div>
        </div>
    );
};
