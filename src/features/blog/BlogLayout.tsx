import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, ExternalLink, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getArticles, getSocialPosts, type Article, type SocialPost } from '../../lib/db';

export const BlogLayout: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [a, s] = await Promise.all([getArticles(), getSocialPosts()]);
                setArticles(a);
                setSocialPosts(s);
            } catch (error) {
                console.error("Failed to load content", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center text-primary">Loading content...</div>;
    }

    const featuredPost = articles[0];
    const otherPosts = articles.slice(1);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-light dark:bg-dark">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4"
                    >
                        Expert Knowledge Hub
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-serif"
                    >
                        Nutrition Science, <span className="italic text-primary-600">Simplified.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Evidence-based articles reviewed by Arunima Dhar.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-3">
                        {/* Featured Post */}
                        {featuredPost && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-12 group relative rounded-3xl overflow-hidden aspect-[2/1]"
                            >
                                <img
                                    src={featuredPost.imageUrl}
                                    alt={featuredPost.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                                    <div className="flex items-center space-x-4 text-white/80 mb-4 text-sm">
                                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full">{featuredPost.category}</span>
                                        <span className="flex items-center"><Clock size={14} className="mr-1" /> {featuredPost.readTime}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif leading-tight group-hover:text-primary-200 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                                        {featuredPost.excerpt}
                                    </p>
                                    {featuredPost.slug.startsWith('http') ? (
                                        <Link
                                            to={`/article/source/${featuredPost.id}`}
                                            className="inline-flex items-center text-white font-semibold hover:text-primary-300 transition-colors"
                                        >
                                            Read Article <ExternalLink size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/blog/${featuredPost.slug}`}
                                            className="inline-flex items-center text-white font-semibold hover:text-primary-300 transition-colors"
                                        >
                                            Read Article <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Recent Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {otherPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-white/10"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 mb-3 space-x-3">
                                            <span className="flex items-center"><User size={12} className="mr-1" /> {post.author.name}</span>
                                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-serif group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                                            {post.excerpt}
                                        </p>
                                        {post.slug.startsWith('http') ? (
                                            <Link
                                                to={`/article/source/${post.id}`}
                                                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline"
                                            >
                                                Read more <ExternalLink size={14} className="ml-1" />
                                            </Link>
                                        ) : (
                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline"
                                            >
                                                Read more <ArrowRight size={14} className="ml-1" />
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Social Feed Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Social Highlights</span>
                            </h3>
                            <div className="space-y-4">
                                {socialPosts.map((post) => (
                                    <div key={post.id} className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-black/40 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`p-1.5 rounded-lg ${post.platform === 'instagram' ? 'bg-pink-100 text-pink-600' :
                                                post.platform === 'linkedin' ? 'bg-blue-100 text-blue-600' : 'bg-sky-100 text-sky-600'
                                                }`}>
                                                {post.platform === 'instagram' && <Instagram size={14} />}
                                                {post.platform === 'linkedin' && <Linkedin size={14} />}
                                                {post.platform === 'twitter' && <Twitter size={14} />}
                                            </div>
                                            <a href={post.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-gray-300 mb-2 font-medium line-clamp-3">
                                            "{post.caption}"
                                        </p>
                                        <div className="text-xs text-slate-400">
                                            Posted on {post.platform}
                                        </div>
                                    </div>
                                ))}
                                {socialPosts.length === 0 && <div className="text-sm text-center text-gray-500">No social updates yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
