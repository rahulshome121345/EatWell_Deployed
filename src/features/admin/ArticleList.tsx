
import React, { useState, useEffect } from 'react';
import { getArticles, deleteArticle, type Article } from '../../lib/db';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Loader } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getArticles();
            setArticles(data);
        } catch (error) {
            console.error("Failed to load articles", error);
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

    if (loading) return <div className="flex items-center justify-center p-12 text-primary"><Loader className="animate-spin mr-2" /> Loading articles...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Articles</h2>
                <Link to="/admin/articles/new" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
                    <Plus size={18} /> New Article
                </Link>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                <table className="w-full text-left text-slate-600 dark:text-gray-300">
                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-slate-900 dark:text-white">{article.title}</td>
                                <td className="p-4 text-sm">{article.author.name}</td>
                                <td className="p-4 text-sm">
                                    {article.createdAt instanceof Timestamp ? article.createdAt.toDate().toLocaleDateString() : article.publishedAt}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link to={`/admin/articles/edit/${article.id}`} className="inline-block p-2 text-slate-400 hover:text-primary transition-colors">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => article.id && handleDeleteArticle(article.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400 dark:text-gray-500">
                                    No articles found yet. Click "New Article" to write one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
