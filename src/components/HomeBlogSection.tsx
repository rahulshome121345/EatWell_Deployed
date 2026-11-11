import { motion } from 'framer-motion';
import { Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticles, type Article } from '../lib/db';

export const HomeBlogSection: React.FC = () => {
    const [featuredPost, setFeaturedPost] = useState<Article | null>(null);

    useEffect(() => {
        const load = async () => {
            const articles = await getArticles();
            if (articles.length > 0) {
                setFeaturedPost(articles[0]);
            }
        };
        load();
    }, []);

    if (!featuredPost) return null; // Don't show section if no articles

    return (
        <section className="relative py-24 bg-slate-50 dark:bg-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-serif">
                        Nutrition Science, <span className="italic text-primary-500">Simplified.</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl">
                        Explore our latest evidence-based insights.
                    </p>
                </motion.div>

                {/* Featured Parallax Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="group relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[2.5/1] shadow-2xl border border-white/10"
                >
                    {/* Background Image with Hover Zoom */}
                    <img
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent dark:from-dark dark:via-dark/60 dark:to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:max-w-4xl">
                        <div className="flex items-center space-x-4 text-white/80 mb-4 text-sm">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full shadow-lg shadow-primary-900/20">
                                {featuredPost.category}
                            </span>
                            <span className="flex items-center backdrop-blur-md bg-white/10 px-3 py-1 rounded-full">
                                <Clock size={14} className="mr-2" /> {featuredPost.readTime}
                            </span>
                        </div>

                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight group-hover:text-primary-200 transition-colors duration-300">
                            {featuredPost.title}
                        </h3>

                        {featuredPost.slug.startsWith('http') ? (
                            <Link
                                to={`/article/source/${featuredPost.id}`}
                                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-sm transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105 shadow-xl"
                            >
                                Read Article <ExternalLink size={18} className="ml-2" />
                            </Link>
                        ) : (
                            <Link
                                to={`/blog/${featuredPost.slug}`}
                                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-sm transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105 shadow-xl"
                            >
                                Read Article <ArrowRight size={18} className="ml-2" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
