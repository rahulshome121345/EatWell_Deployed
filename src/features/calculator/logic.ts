export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface UserStats {
    age: number;
    weight: number; // in kg
    height: number; // in cm
    gender: Gender;
    activityLevel: ActivityLevel;
    goal: 'lose' | 'maintain' | 'gain';
}

export const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

export const calculateBMR = (stats: UserStats): number => {
    // Mifflin-St Jeor Equation
    const { weight, height, age, gender } = stats;
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.round(bmr);
};

export const calculateTDEE = (stats: UserStats): number => {
    const bmr = calculateBMR(stats);
    const multiplier = activityMultipliers[stats.activityLevel];
    return Math.round(bmr * multiplier);
};

export const calculateTargetCalories = (stats: UserStats): number => {
    const tdee = calculateTDEE(stats);

    switch (stats.goal) {
        case 'lose': return Math.round(tdee - 500); // 0.5kg loss/week
        case 'gain': return Math.round(tdee + 500); // 0.5kg gain/week
        default: return tdee;
    }
};
