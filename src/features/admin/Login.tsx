

import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, UserPlus } from 'lucide-react';

const ALLOWED_ADMINS = ['rahulshome828@gmail.com', 'darunima20@gmail.com'];

export const Login: React.FC = () => {
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (isSetupMode) {
                // Restricted Setup Logic
                if (!ALLOWED_ADMINS.includes(email.trim().toLowerCase())) {
                    setError("Access Denied. This email is not authorized for admin access.");
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, password);
                setMessage("Account created successfully! Logging you in...");
                setTimeout(() => navigate('/admin'), 1500);
            } else {
                // Login Logic
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/admin');
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error && 'code' in err) {
                const firebaseError = err as { code: string; message: string };
                if (firebaseError.code === 'auth/email-already-in-use') {
                    setError("Account already exists. Please login instead.");
                } else if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found') {
                    setError("Invalid credentials. Please try again.");
                } else {
                    setError(firebaseError.message || "An error occurred.");
                }
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
            setError('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
            <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-xl dark:shadow-none">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-primary/20 mb-4">
                        <Lock className="text-primary" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isSetupMode ? "Admin Setup" : "Admin Access"}
                    </h1>
                </div>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-500/20 text-green-200 p-3 rounded-lg mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-primary outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                        {isSetupMode ? "Create Admin Account" : "Login"}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-3 text-center">
                    {!isSetupMode && (
                        <button
                            onClick={handleForgotPassword}
                            className="text-sm text-slate-500 hover:text-primary dark:text-gray-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <Mail size={14} /> Forgot Password?
                        </button>
                    )}

                    <button
                        onClick={() => {
                            setIsSetupMode(!isSetupMode);
                            setError('');
                            setMessage('');
                        }}
                        className="text-sm text-primary hover:text-primary-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {isSetupMode ? (
                            <>Back to Login</>
                        ) : (
                            <><UserPlus size={14} /> First Time Setup?</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
