import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, Camera, Calculator, Home, HeartPulse, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Calculator', path: '/calculator', icon: <Calculator size={18} /> },
        { name: 'AI Scan', path: '/scan', icon: <Camera size={18} /> },
        { name: 'Check Symptoms', path: '/symptoms', icon: <HeartPulse size={18} /> },
        { name: 'Knowledge Hub', path: '/blog', icon: <BookOpen size={18} /> },
        { name: 'About Me', path: '/about', icon: <User size={18} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Activity className="text-primary" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            EatWell
                        </span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive(link.path)
                                        ? 'text-primary'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="navbar-glow"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(45,212,191,0.8)] rounded-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white/95 dark:bg-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};
