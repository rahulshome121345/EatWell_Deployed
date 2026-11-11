
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { LayoutDashboard, FileText, Share2, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin/login');
            } else if (user.email !== 'darunima20@gmail.com' && user.email !== 'rahulshome828@gmail.com') {
                // Security Check: Only allow specific emails
                // Adding your email as fallback just in case, removing otherwise
                alert("Access Denied: You are not an authorized administrator.");
                auth.signOut();
                navigate('/admin/login');
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [navigate]);

    const handleLogout = () => {
        auth.signOut();
    };

    if (loading) return <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center text-primary">Loading...</div>;

    return (
        <div className="min-h-screen bg-light dark:bg-dark flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-white/10 p-6 flex flex-col bg-white dark:bg-dark">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Admin Console</h1>

                <nav className="space-y-2 flex-1">
                    <Link to="/admin" className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/articles" className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <FileText size={20} />
                        <span>Articles</span>
                    </Link>
                    <Link to="/admin/social" className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <Share2 size={20} />
                        <span>Social Posts</span>
                    </Link>
                </nav>

                <button onClick={handleLogout} className="flex items-center space-x-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-white/5 transition-colors mt-auto">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
