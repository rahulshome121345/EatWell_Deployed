import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getArticleBySlug, type Article } from '../../lib/db';

export const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (slug) {
                const article = await getArticleBySlug(slug);
                if (article) setPost(article);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading article...</div>;
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Article not found. <Link to="/blog" className="ml-2 text-primary underline">Go back</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-light dark:bg-dark pb-24">
            {/* Parallax Hero */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-dark/90 to-transparent pt-32 pb-12">
                    <div className="max-w-3xl mx-auto px-6">
                        <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={20} className="mr-2" /> Back to Knowledge Hub
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold text-sm mr-3">
                                    {post.author.name.charAt(4)}
                                </div>
                                <div>
                                    <div className="font-semibold">{post.author.name}</div>
                                    <div className="text-xs opacity-80">{post.author.credentials}</div>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <Calendar size={16} className="mr-2" /> {post.publishedAt}
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock size={16} className="mr-2" /> {post.readTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-30">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
                    {/* Expert Verification Badge */}
                    <div className="flex items-center bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mb-10">
                        <ShieldCheck className="text-green-600 dark:text-green-400 mr-3 flex-shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-green-900 dark:text-green-300 text-sm">Medically Reviewed</h4>
                            <p className="text-xs text-green-800 dark:text-green-400">
                                This article was reviewed by {post.author.name} for clinical accuracy.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert prose-primary max-w-none font-serif">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-400 italic">
                            Disclaimer: Content is for educational purposes only and not medical advice. Consult a healthcare provider for specific concerns.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
};
