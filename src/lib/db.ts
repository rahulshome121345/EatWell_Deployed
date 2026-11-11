
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Helper types
export interface Article {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    readTime: string;
    author: {
        name: string;
        credentials: string;
    };
    publishedAt: string; // ISO String or Display String
    createdAt: Timestamp;
    tags?: string[]; // Keywords for matching (e.g., ["dehydration", "blood-sugar", "fatigue"])
    expertVerified?: boolean; // Badge indicator
}

export interface SocialPost {
    id?: string;
    platform: 'instagram' | 'twitter' | 'linkedin';
    url: string;
    caption: string;
    createdAt: Timestamp;
}

// Collections
const ARTICLES_COLLECTION = 'articles';
const SOCIAL_COLLECTION = 'social_posts';

// --- Article Service ---

export const getArticles = async () => {
    const q = query(collection(db, ARTICLES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
};

export const getArticleBySlug = async (slug: string) => {
    // Note: In a real app, you'd query by slug. For simplicity, fetching all and finding or using slug as ID.
    // Let's assume we query.
    const q = query(collection(db, ARTICLES_COLLECTION));
    const snapshot = await getDocs(q);
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    return articles.find(a => a.slug === slug);
};

export const getArticleById = async (id: string) => {
    // Re-using getArticles is inefficient but safe for now.
    return (await getArticles()).find(a => a.id === id);
};

export const createArticle = async (article: Omit<Article, 'id'>) => {
    return await addDoc(collection(db, ARTICLES_COLLECTION), article);
};

export const updateArticle = async (id: string, article: Partial<Article>) => {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    return await updateDoc(docRef, article);
};

export const deleteArticle = async (id: string) => {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    return await deleteDoc(docRef);
};

// --- Social Post Service ---

export const getSocialPosts = async () => {
    const q = query(collection(db, SOCIAL_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPost));
};

export const createSocialPost = async (post: Omit<SocialPost, 'id'>) => {
    return await addDoc(collection(db, SOCIAL_COLLECTION), post);
};

export const deleteSocialPost = async (id: string) => {
    const docRef = doc(db, SOCIAL_COLLECTION, id);
    return await deleteDoc(docRef);
};
