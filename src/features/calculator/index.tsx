import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, CheckCircle2, ChefHat, Loader2, Sun, Moon, CloudSun, Coffee } from 'lucide-react';
import { calculateBMR, calculateTargetCalories, calculateTDEE } from './logic';
import type { UserStats, Gender, ActivityLevel } from './logic';
import { generateMealPlan, type MealPlan } from '../../lib/gemini';
import { usePersistentState } from '../../hooks/usePersistentState';

const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'light', label: 'Light', desc: 'Exercise 1-3 times/week' },
    { value: 'moderate', label: 'Moderate', desc: 'Exercise 4-5 times/week' },
    { value: 'active', label: 'Active', desc: 'Daily exercise or intense exercise 3-4 times/week' },
    { value: 'very_active', label: 'Very Active', desc: 'Intense exercise 6-7 times/week' },
];

export const CalorieCalculator: React.FC = () => {
    // Persist all user data and results
    const [step, setStep] = usePersistentState<number>("calc_step", 1);
    const [stats, setStats] = usePersistentState<UserStats>("calc_stats", {
        age: 25,
        weight: 70,
        height: 170,
        gender: 'female',
        activityLevel: 'moderate',
        goal: 'maintain',
    });
    const [result, setResult] = usePersistentState<{ bmr: number; tdee: number; target: number } | null>("calc_result", null);
    const [mealPlan, setMealPlan] = usePersistentState<MealPlan | null>("calc_meal_plan", null);

    const [loadingPlan, setLoadingPlan] = useState(false);
    const [heightUnit, setHeightUnit] = usePersistentState<'cm' | 'ft'>("calc_height_unit", 'cm');
    const [planError, setPlanError] = useState<string | null>(null);

    // Derived values for Ft/In inputs
    const heightFt = Math.floor(stats.height / 30.48);
    const heightIn = Math.round((stats.height % 30.48) / 2.54);

    const handleGeneratePlan = async () => {
        if (!result) return;
        setLoadingPlan(true);
        setPlanError(null);
        try {
            const plan = await generateMealPlan(result.target);
            setMealPlan(plan);
        } catch (error) {
            console.error(error);
            if ((error as Error).message?.includes("429")) {
                setPlanError("AI is busy (Rate Limit). Please try again in a minute.");
            } else {
                setPlanError("Failed to generate plan. Please try again.");
            }
        } finally {
            setLoadingPlan(false);
        }
    };

    const updateHeightFromFtIn = (ft: number, inc: number) => {
        const cm = (ft * 30.48) + (inc * 2.54);
        updateStats('height', Math.round(cm));
    };

    const calculate = () => {
        const bmr = calculateBMR(stats);
        const tdee = calculateTDEE(stats);
        const target = calculateTargetCalories(stats);
        setResult({ bmr, tdee, target });
        setStep(4);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateStats = (key: keyof UserStats, value: UserStats[keyof UserStats]) => {
        setStats(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-10 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Smart Calorie Planner
                    </h1>
                    <p className="text-slate-600 dark:text-gray-400">
                        Precision nutrition tailored to your biometrics.
                    </p>
                </motion.div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-2xl font-bold mb-8">Basic Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Gender</label>
                                    <div className="flex gap-4">
                                        {(['male', 'female'] as Gender[]).map(g => (
                                            <button
                                                key={g}
                                                onClick={() => updateStats('gender', g)}
                                                className={`flex-1 py-3 rounded-xl border transition-all duration-300 relative overflow-hidden group ${stats.gender === g
                                                    ? 'bg-gradient-to-br from-primary/30 to-primary/5 border-primary/50 text-slate-900 dark:text-white shadow-[0_0_30px_rgba(45,212,191,0.3)] scale-[1.02]'
                                                    : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {g.charAt(0).toUpperCase() + g.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={stats.age || ''}
                                        onChange={(e) => updateStats('age', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors mb-3 text-slate-900 dark:text-white"
                                    />
                                    <input
                                        type="range"
                                        min="16"
                                        max="100"
                                        value={stats.age || 25}
                                        onChange={(e) => updateStats('age', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-slate-600 dark:text-gray-400">Height</label>
                                        <div className="flex bg-slate-100 dark:bg-black/40 rounded-lg p-1 border border-slate-200 dark:border-white/10">
                                            <button
                                                onClick={() => setHeightUnit('cm')}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${heightUnit === 'cm' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
                                            >
                                                CM
                                            </button>
                                            <button
                                                onClick={() => setHeightUnit('ft')}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${heightUnit === 'ft' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
                                            >
                                                FT
                                            </button>
                                        </div>
                                    </div>

                                    {heightUnit === 'cm' ? (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={stats.height || ''}
                                                    onChange={(e) => updateStats('height', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors text-slate-900 dark:text-white"
                                                    placeholder="e.g. 175"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-500 text-sm">cm</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="120"
                                                max="220"
                                                value={stats.height || 170}
                                                onChange={(e) => updateStats('height', parseInt(e.target.value))}
                                                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    value={heightFt || ''}
                                                    onChange={(e) => updateHeightFromFtIn(e.target.value === '' ? 0 : parseInt(e.target.value), heightIn)}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors text-slate-900 dark:text-white"
                                                    placeholder="5"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-500 text-sm">ft</span>
                                            </div>
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    value={heightIn === 0 ? '' : heightIn}
                                                    onChange={(e) => updateHeightFromFtIn(heightFt, e.target.value === '' ? 0 : parseInt(e.target.value))}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors text-slate-900 dark:text-white"
                                                    placeholder="10"
                                                />
                                                <span className="absolute right-4 top-3.5 text-gray-500 text-sm">in</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={stats.weight || ''}
                                        onChange={(e) => updateStats('weight', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors mb-3 text-slate-900 dark:text-white"
                                    />
                                    <input
                                        type="range"
                                        min="40"
                                        max="150"
                                        value={stats.weight || 70}
                                        onChange={(e) => updateStats('weight', parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>
                            <div className="mt-10 flex justify-end">
                                <button onClick={nextStep} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                                    Next <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-2xl font-bold mb-8">Activity Level</h2>
                            <div className="space-y-4">
                                {activityOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateStats('activityLevel', opt.value as ActivityLevel)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${stats.activityLevel === opt.value ? 'bg-primary/20 border-primary' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        <div>
                                            <div className={`font-semibold ${stats.activityLevel === opt.value ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{opt.label}</div>
                                            <div className="text-sm text-slate-500 dark:text-gray-400">{opt.desc}</div>
                                        </div>
                                        {stats.activityLevel === opt.value && <CheckCircle2 className="text-primary" />}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-10 flex justify-between">
                                <button onClick={prevStep} className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white px-4">Back</button>
                                <button onClick={nextStep} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                                    Next <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-2xl font-bold mb-8">Your Goal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { value: 'lose', label: 'Lose Weight', desc: 'Deficit of 500 cal/day' },
                                    { value: 'maintain', label: 'Maintain', desc: 'Keep current weight' },
                                    { value: 'gain', label: 'Gain Muscle', desc: 'Surplus of 500 cal/day' }
                                ].map((goal) => (
                                    <button
                                        key={goal.value}
                                        onClick={() => updateStats('goal', goal.value as UserStats['goal'])}
                                        className={`p-6 rounded-2xl border transition-all text-center ${stats.goal === goal.value ? 'bg-primary/20 border-primary' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                    >
                                        <div className={`text-xl font-bold mb-2 ${stats.goal === goal.value ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{goal.label}</div>
                                        <div className="text-sm text-slate-500 dark:text-gray-400">{goal.desc}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-10 flex justify-between">
                                <button onClick={prevStep} className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white px-4">Back</button>
                                <button onClick={calculate} className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                                    Calculate Plan <Activity size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && result && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-2 text-white">Your Daily Plan</h2>
                                <p className="text-gray-400">Based on your activity and goals</p>
                                <p className="text-xs text-gray-500 mt-2 font-medium flex justify-center items-center gap-1.5">
                                    <Activity size={12} className="text-emerald-500" />
                                    Powered by Mifflin-St Jeor & Academy of Nutrition
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-slate-50 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                                    <div className="text-slate-500 dark:text-gray-400 text-sm mb-1">BMR</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-gray-200">{result.bmr}</div>
                                    <div className="text-xs text-slate-500 dark:text-gray-500 mt-1">Base Metabolic Rate</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/30 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
                                    <div className="text-slate-500 dark:text-gray-400 text-sm mb-1">TDEE</div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-gray-200">{result.tdee}</div>
                                    <div className="text-xs text-slate-500 dark:text-gray-500 mt-1">Total Daily Energy</div>
                                </div>
                                <div className="bg-primary/20 p-6 rounded-2xl border border-primary/30 text-center relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-primary text-sm font-bold mb-1 uppercase tracking-wider">Target</div>
                                        <div className="text-4xl font-bold text-white">{result.target}</div>
                                        <div className="text-xs text-primary/80 mt-1">Calories / Day</div>
                                    </div>
                                </div>
                            </div>

                            {!mealPlan ? (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleGeneratePlan}
                                        disabled={loadingPlan}
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                                    >
                                        {loadingPlan ? <Loader2 className="animate-spin" /> : <ChefHat />}
                                        {loadingPlan ? "Designing Menu..." : "Generate AI Meal Plan"}
                                    </button>
                                    {planError && (
                                        <p className="text-red-400 text-sm mt-3 animate-pulse">{planError}</p>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 space-y-6"
                                >
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <ChefHat className="text-purple-400" size={28} />
                                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Chef's Recommendation
                                        </span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { type: 'breakfast', label: 'Breakfast', icon: <Sun size={20} />, data: mealPlan.breakfast, color: 'from-orange-400/20 to-orange-600/5 border-orange-500/30' },
                                            { type: 'lunch', label: 'Lunch', icon: <CloudSun size={20} />, data: mealPlan.lunch, color: 'from-green-400/20 to-green-600/5 border-green-500/30' },
                                            { type: 'dinner', label: 'Dinner', icon: <Moon size={20} />, data: mealPlan.dinner, color: 'from-blue-400/20 to-blue-600/5 border-blue-500/30' },
                                            { type: 'snack', label: 'Snack', icon: <Coffee size={20} />, data: mealPlan.snack, color: 'from-purple-400/20 to-purple-600/5 border-purple-500/30' }
                                        ].map((meal, i) => (
                                            <motion.div
                                                key={meal.type}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`p-5 rounded-2xl border ${meal.color} bg-gradient-to-br relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20 transition-all`}
                                            >
                                                <div className="flex items-center gap-2 mb-3 text-white/90">
                                                    <div className="p-2 rounded-lg bg-white/20 dark:bg-white/5 backdrop-blur-sm">
                                                        {meal.icon}
                                                    </div>
                                                    <span className="font-bold text-sm tracking-widest uppercase opacity-70">{meal.label}</span>
                                                </div>

                                                <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                                    {meal.data.name}
                                                </h4>

                                                <div className="text-sm text-gray-100 dark:text-gray-400 leading-relaxed border-t border-white/20 dark:border-white/5 pt-3 mt-3">
                                                    {meal.data.details}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Macros Summary Bar */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        {[
                                            { label: 'Protein', val: mealPlan.macros.p + 'g', color: 'bg-blue-500/20 text-blue-300' },
                                            { label: 'Carbs', val: mealPlan.macros.c + 'g', color: 'bg-green-500/20 text-green-300' },
                                            { label: 'Fats', val: mealPlan.macros.f + 'g', color: 'bg-orange-500/20 text-orange-300' },
                                        ].map(m => (
                                            <div key={m.label} className={`p-3 rounded-xl ${m.color} text-center font-bold border border-white/10 dark:border-white/5`}>
                                                <div className="text-xs opacity-70 uppercase mb-1">{m.label}</div>
                                                <div className="text-xl">{m.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div className="text-center mt-8">
                                <button onClick={() => { setStep(1); setMealPlan(null); }} className="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm">
                                    Recalculate
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div >
        </div >
    );
};
