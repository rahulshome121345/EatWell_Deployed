
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 dark:bg-dark/50 border-t border-slate-200 dark:border-white/5 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-gray-400 flex items-center justify-center gap-2">
                    Made with <Heart className="text-red-500 fill-red-500" size={16} /> for better health
                </p>
                <p className="text-xs text-gray-600 mt-2">
                    © 2026 EatWell AI. Not medical advice.
                </p>
            </div>
        </footer>
    );
};
