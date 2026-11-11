
import React, { useState, useEffect } from 'react';
import { getSocialPosts, createSocialPost, deleteSocialPost, type SocialPost } from '../../lib/db';
import { Timestamp } from 'firebase/firestore';
import { Trash2, Link as LinkIcon, Instagram, Linkedin, Twitter, Plus } from 'lucide-react';

export const SocialPostManager: React.FC = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // New Post Form State
    const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin'>('instagram');
    const [url, setUrl] = useState('');
    const [caption, setCaption] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const p = await getSocialPosts();
        setPosts(p);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createSocialPost({
                platform,
                url,
                caption,
                createdAt: Timestamp.now()
            });
            // Reset form and reload
            setUrl('');
            setCaption('');
            await loadPosts();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this post?')) {
            await deleteSocialPost(id);
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Social Media Posts</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 sticky top-4">
                        <h3 className="text-lg font-bold text-white mb-4">Add New Post</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Platform</label>
                                <div className="flex gap-2">
                                    {(['instagram', 'linkedin', 'twitter'] as const).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPlatform(p)}
                                            className={`p-2 rounded-lg border transition-all ${platform === p
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'border-white/10 hover:bg-white/5 text-gray-400'
                                                }`}
                                        >
                                            {p === 'instagram' && <Instagram size={20} />}
                                            {p === 'linkedin' && <Linkedin size={20} />}
                                            {p === 'twitter' && <Twitter size={20} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Post URL</label>
                                <input
                                    required
                                    type="url"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Caption / Note</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary/90 flex justify-center items-center gap-2"
                            >
                                {submitting ? 'Adding...' : <><Plus size={16} /> Add Post</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? <div className="text-white">Loading...</div> : posts.map(post => (
                        <div key={post.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4 group relative overflow-hidden">
                            <div className={`p-3 rounded-full bg-black/20 h-fit shrink-0 ${post.platform === 'instagram' ? 'text-pink-400' :
                                post.platform === 'linkedin' ? 'text-blue-400' : 'text-sky-400'
                                }`}>
                                {post.platform === 'instagram' && <Instagram size={20} />}
                                {post.platform === 'linkedin' && <Linkedin size={20} />}
                                {post.platform === 'twitter' && <Twitter size={20} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-white text-sm mb-1.5 font-medium leading-relaxed">{post.caption}</p>
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-primary hover:text-primary-400 hover:underline flex items-center gap-1.5 w-fit"
                                    title={post.url}
                                >
                                    <LinkIcon size={12} className="shrink-0" />
                                    <span className="truncate max-w-[300px]">{post.url}</span>
                                </a>
                            </div>
                            <button
                                onClick={() => post.id && handleDelete(post.id)}
                                className="absolute right-2 top-2 p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete Post"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {!loading && posts.length === 0 && (
                        <div className="text-center text-gray-500 py-12">No posts yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
