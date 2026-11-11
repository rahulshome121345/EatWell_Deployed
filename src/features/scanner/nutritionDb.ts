// Nutrition Database matching common MobileNet ImageNet classes significantly
export interface NutritionInfo {
    calories: number; // per 100g approx
    protein: number;
    carbs: number;
    fat: number;
    displayName: string;
}

// Map common food items found in ImageNet to nutrition
export const NUTRITION_DB: Record<string, NutritionInfo> = {
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, displayName: 'Apple' },
    'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, displayName: 'Orange' },
    'banana': { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, displayName: 'Banana' },
    'strawberry': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, displayName: 'Strawberry' },
    'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, displayName: 'Pineapple' },
    'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, displayName: 'Broccoli' },
    'cucumber': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, displayName: 'Cucumber' },
    'mushroom': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, displayName: 'Mushroom' },
    'bell pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, displayName: 'Bell Pepper' },

    // Fast Food / Processed
    'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, displayName: 'Pizza' },
    'burger': { calories: 295, protein: 17, carbs: 30, fat: 14, displayName: 'Burger' },
    'cheeseburger': { calories: 303, protein: 15, carbs: 30, fat: 14, displayName: 'Cheeseburger' },
    'hotdog': { calories: 290, protein: 10, carbs: 26, fat: 12, displayName: 'Hot Dog' },
    'burrito': { calories: 206, protein: 8, carbs: 32, fat: 5, displayName: 'Burrito' },
    'taco': { calories: 226, protein: 9, carbs: 20, fat: 13, displayName: 'Taco' },
    'french fries': { calories: 312, protein: 3.4, carbs: 41, fat: 15, displayName: 'French Fries' },
    'ice cream': { calories: 207, protein: 3.5, carbs: 24, fat: 11, displayName: 'Ice Cream' },
    'chocolate': { calories: 546, protein: 4.9, carbs: 61, fat: 31, displayName: 'Chocolate' },

    // Drinks
    'espresso': { calories: 9, protein: 0.1, carbs: 1.7, fat: 0.2, displayName: 'Espresso' },
    'cup': { calories: 0, protein: 0, carbs: 0, fat: 0, displayName: 'Water/Beverage' }, // Often detected for drinks
    'coffee mug': { calories: 5, protein: 0.1, carbs: 0, fat: 0, displayName: 'Black Coffee' },

    // General Fallback categories
    'plate': { calories: 400, protein: 20, carbs: 40, fat: 15, displayName: 'Mixed Meal' },
    'restaurant': { calories: 600, protein: 25, carbs: 50, fat: 30, displayName: 'Restaurant Meal' },
    'bakery': { calories: 350, protein: 5, carbs: 50, fat: 15, displayName: 'Baked Goods' },
};

export const getNutritionFromPredictions = (predictions: { className: string; probability: number }[]): NutritionInfo & { confidence: number } | null => {
    // Try to find the first matching item in our DB
    for (const p of predictions) {
        const names = p.className.toLowerCase().split(',').map(s => s.trim());
        for (const name of names) {
            if (NUTRITION_DB[name]) {
                return {
                    ...NUTRITION_DB[name],
                    confidence: Math.round(p.probability * 100)
                };
            }
            // Partial match check
            const partialMatch = Object.keys(NUTRITION_DB).find(k => name.includes(k));
            if (partialMatch) {
                return {
                    ...NUTRITION_DB[partialMatch],
                    confidence: Math.round(p.probability * 100)
                };
            }
        }
    }

    return null; // No match found
};
