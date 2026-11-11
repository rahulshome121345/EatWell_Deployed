
import React, { useState, useEffect } from 'react';
import { getArticles, getSocialPosts, deleteArticle, deleteSocialPost, type Article, type SocialPost } from '../../lib/db';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const Dashboard: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [a, p] = await Promise.all([getArticles(), getSocialPosts()]);
            setArticles(a);
            setPosts(p);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteArticle = async (id: string) => {
        if (confirm('Are you sure you want to delete this article?')) {
            await deleteArticle(id);
            setArticles(articles.filter(a => a.id !== id));
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm('Delete this social post?')) {
            await deleteSocialPost(id);
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    if (loading) return <div className="text-white">Loading dashboard...</div>;

    return (
        <div className="space-y-12">
            {/* Articles Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Articles</h2>
                    <Link to="/admin/articles/new" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
                        <Plus size={18} /> New Article
                    </Link>
                </div>

                <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map(article => (
                                <tr key={article.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-medium text-white">{article.title}</td>
                                    <td className="p-4 text-sm">{article.author.name}</td>
                                    <td className="p-4 text-sm">
                                        {article.createdAt instanceof Timestamp ? article.createdAt.toDate().toLocaleDateString() : article.publishedAt}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link to={`/admin/articles/edit/${article.id}`} className="inline-block p-2 hover:text-primary transition-colors">
                                            <Edit size={18} />
                                        </Link>
                                        <button onClick={() => article.id && handleDeleteArticle(article.id)} className="p-2 hover:text-red-400 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No articles found. Create one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Social Posts Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Social Feed</h2>
                    <Link to="/admin/social" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
                        <Plus size={18} /> Manage Posts
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded bg-black/30 ${post.platform === 'instagram' ? 'text-pink-400' :
                                        post.platform === 'linkedin' ? 'text-blue-400' : 'text-sky-400'
                                    }`}>{post.platform}</span>
                                <button onClick={() => post.id && handleDeletePost(post.id)} className="text-gray-500 hover:text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-300 mb-3 line-clamp-2">{post.caption}</p>
                            <a href={post.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                View Post <ExternalLink size={12} />
                            </a>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="col-span-full text-gray-500 text-center py-8">No social posts added.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
