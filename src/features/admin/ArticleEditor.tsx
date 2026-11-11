import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, updateArticle, type Article } from '../../lib/db'; // Import updateArticle
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Timestamp, doc, getDoc } from 'firebase/firestore'; // Import doc, getDoc
import { ArrowLeft, Upload, Loader2, Sparkles } from 'lucide-react';
import { enhanceArticleContent } from '../../lib/gemini';

export const ArticleEditor: React.FC = () => {
    const { id } = useParams(); // If we have ID, it's edit mode
    const navigate = useNavigate();
    const [status, setStatus] = useState(''); // Empty = idle, otherwise loading message
    const [error, setError] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Nutrition');
    const [readTime, setReadTime] = useState('5 min read');
    const [authorName] = useState('Arunima Dhar');
    const [authorCreds] = useState('Research Scholar, IIT Guwahati');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Load data if Edit Mode
    useEffect(() => {
        if (id) {
            const loadArticle = async () => {
                setStatus('Loading article...');
                try {
                    const docRef = doc(db, 'articles', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setTitle(data.title);
                        setSlug(data.slug);
                        setExcerpt(data.excerpt);
                        setContent(data.content);
                        setCategory(data.category);
                        setReadTime(data.readTime);
                        setImageUrl(data.imageUrl as string);
                    } else {
                        setError("Article not found!");
                        navigate('/admin');
                    }
                } catch (error) {
                    console.error("Error loading article:", error);
                    setError("Failed to load article: " + (error as Error).message);
                } finally {
                    setStatus('');
                }
            };
            loadArticle();
        }
    }, [id, navigate]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            // Create a temporary preview URL
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('Initializing...');

        try {
            let finalImageUrl = imageUrl;

            // Upload Image if selected and it's a file (blob url)
            if (imageFile) {
                setStatus('Uploading image (15s timeout)...');

                const storageRef = ref(storage, `blog-images/${Date.now()}_${imageFile.name}`);

                // Create a timeout promise
                const uploadPromise = uploadBytes(storageRef, imageFile);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Upload timed out. This is common on localhost due to CORS. Try deploying the app.")), 15000)
                );

                await Promise.race([uploadPromise, timeoutPromise]);
                const snapshot = await uploadPromise; // Get the actual result

                setStatus('Getting image URL...');
                finalImageUrl = await getDownloadURL(snapshot.ref);
            }

            setStatus('Saving article to database...');
            const articleData = {
                title,
                slug: slug || generateSlug(title),
                excerpt,
                content,
                category,
                readTime,
                imageUrl: finalImageUrl,
                author: {
                    name: authorName,
                    credentials: authorCreds
                },
                // If create: Published Now. If update: Keep original, maybe update 'updatedAt'
                ...(id ? {} : {
                    publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    createdAt: Timestamp.now()
                })
            };

            const fullArticleData: Omit<Article, 'id'> = {
                ...articleData,
                publishedAt: 'publishedAt' in articleData && articleData.publishedAt ? articleData.publishedAt as string : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                createdAt: 'createdAt' in articleData && articleData.createdAt ? articleData.createdAt as Timestamp : Timestamp.now()
            };

            if (id) {
                await updateArticle(id, articleData);
            } else {
                await createArticle(fullArticleData);
            }

            setStatus('Success!');
            navigate('/admin');

        } catch (error) {
            console.error("Error saving article:", error);
            setError("Failed to save article: " + (error as Error).message);
        } finally {
            setStatus('');
        }
    };

    const handleAiEnhance = async () => {
        if (!content.trim()) return;
        setAiLoading(true);
        try {
            const enhanced = await enhanceArticleContent(content, title, category);
            setContent(enhanced);
        } catch (error) {
            console.error("Failed to enhance content", error);
            alert("Failed to enhance content. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="p-8">
            <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-white mb-8 font-serif">
                {id ? 'Edit Article' : 'New Article'}
            </h1>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                {/* Basic Info */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Basic Info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm text-gray-400">Slug (URL)</label>
                                <button
                                    type="button"
                                    onClick={() => setSlug(generateSlug(title))}
                                    className="text-xs text-primary hover:text-primary-300 transition-colors flex items-center gap-1"
                                >
                                    <Sparkles size={12} />
                                    Generate from Title
                                </button>
                            </div>
                            <input
                                type="text"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                placeholder="Paste external link here or generate slug"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none font-mono text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            >
                                <option value="Nutrition" className="bg-slate-900 text-white">Nutrition</option>
                                <option value="Lifestyle" className="bg-slate-900 text-white">Lifestyle</option>
                                <option value="Research" className="bg-slate-900 text-white">Research</option>
                                <option value="General" className="bg-slate-900 text-white">General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Read Time</label>
                            <input
                                type="text"
                                value={readTime}
                                onChange={e => setReadTime(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Excerpt (Short Description)</label>
                        <textarea
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none h-24 resize-none"
                            required
                        />
                    </div>
                </div>

                {/* Cover Image */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Cover Image</h2>
                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-colors hover:border-primary/50 group">
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imageUrl ? (
                            <div className="relative aspect-video w-full max-w-sm mx-auto rounded-lg overflow-hidden">
                                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">Click to change</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-gray-400">
                                <div className="inline-flex p-3 rounded-full bg-white/5 mb-2 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <Upload size={24} />
                                </div>
                                <p>Drop image here or click to upload</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Content (Markdown)</h2>
                        <button
                            type="button"
                            onClick={handleAiEnhance}
                            disabled={aiLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-200 rounded-lg hover:bg-purple-600/30 transition-all border border-purple-500/30 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {aiLoading ? 'Enhancing...' : 'AI Humanize & Refine'}
                        </button>
                    </div>

                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none h-[500px] font-mono leading-relaxed"
                        placeholder="# Heading... Write your article content here..."
                        required
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="px-6 py-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!!status}
                        className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {status ? <Loader2 className="animate-spin mr-2" /> : null}
                        {status || (id ? 'Update Article' : 'Publish Article')}
                    </button>
                </div>
            </form>
        </div>
    );
};
