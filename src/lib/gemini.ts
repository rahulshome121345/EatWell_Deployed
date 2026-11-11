import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing Gemini API Key in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export interface Recommendation {
    title: string;
    detail: string;
}

export interface AnalysisResult {
    condition: string;
    recommendations: Recommendation[]; // Changed from single string
    deficiency?: string;
    severity: "low" | "medium" | "high";
    reasoning: string; // AI's explanation of the diagnosis
    disclaimer: string;
    rawResponse: string;
}

export const analyzeSymptomsWithGemini = async (symptoms: string[]): Promise<AnalysisResult> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
     Act as a nutritional and health assistant. The user has the following symptoms: ${symptoms.join(", ")}.
     
     Analyze these symptoms and provide:
     1. Potential nutritional deficiencies.
     2. A condition name.
     3. 3-4 specific, actionable recommendations (diet/lifestyle) as separate items.
     4. A brief reasoning (2-3 sentences) explaining HOW you arrived at this conclusion.
     
     Output your response in strictly VALID JSON format keys:
     {
       "condition": "Likely condition name",
       "deficiency": "Potential Vitamin/Mineral deficiency",
       "recommendations": [
          { "title": "Actionable Title", "detail": "Specific advice..." },
          { "title": "Dietary Change", "detail": "Eat more..." }
       ],
       "severity": "low" | "medium" | "high",
       "reasoning": "2-3 sentences explaining why you identified this condition based on the symptoms provided. Be clear and educational.",
       "disclaimer": "Standard medical disclaimer"
     }
     
     Do NOT return code blocks. Return ONLY the JSON string.
   `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);
        return {
            ...data,
            rawResponse: text
        };
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw error;
    }
};

export interface MealItem {
    name: string;
    details: string; // Brief description or ingredients
}

export interface MealPlan {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
    calories: number;
    macros: { p: number; c: number; f: number };
}

export const generateMealPlan = async (calories: number, type: string = "balanced"): Promise<MealPlan> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
      Create a 1-day meal plan for a person targeting ${calories} calories. Diet type: ${type}.
      CRITICAL DIETARY RESTRICTION: Do NOT include "Beef" or any beef-related products in any of the meals. Substitute with other protein sources.
      
      Output strictly VALID JSON with this format:
      {
        "breakfast": { "name": "Dish Name", "details": "Brief bullet-point style description" },
        "lunch": { "name": "Dish Name", "details": "Brief bullet-point style description" },
        "dinner": { "name": "Dish Name", "details": "Brief bullet-point style description" },
        "snack": { "name": "Dish Name", "details": "Brief bullet-point style description" },
        "calories": ${calories},
        "macros": { "p": 0, "c": 0, "f": 0 }
      }
      
      Ensure macros (protein, carbs, fat) are approximate integers.
      Do NOT return code blocks. Return ONLY the JSON string.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Meal Plan Gen Failed:", error);
        throw error;
    }
};

export interface FoodNutrition {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    confidence?: number;
    insight?: string;
    servingSize?: string; // e.g. "1 can (355ml)" or "2 slices"
    keyConstituents?: { label: string; value: string; type: 'good' | 'bad' | 'neutral' }[];
}

export const getFoodNutrition = async (foodName: string): Promise<FoodNutrition> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
      Identify the approximate nutritional values for 1 standard serving of: "${foodName}".
      
      Output strictly VALID JSON:
      {
        "name": "${foodName}",
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "servingSize": "1 standard serving"
      }
      
      Values should be integers. Do NOT return code blocks.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Food Gen Failed:", error);
        // Fallback to "Unknown" zero-state if AI fails, to prevent crash
        return { name: foodName, calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: "100g" };
    }
};

export const identifyFoodFromImage = async (base64Image: string): Promise<FoodNutrition> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const prompt = `
      Identify the food in this image.
      Analyze the image and provide:
      1. Estimate PORTION SIZE (e.g. "1 can", "1 bowl").
      2. Calculate nutritional values for THAT portion.
      3. Identify 2-3 "Hidden Bio-Factors" relevant to this SPECIFIC food (e.g. Caffeine/Sodium for soda, Fiber for fruit, Omega-3 for fish).
      4. A single high-impact insight.
      
      3. Identify 2-3 "Hidden Bio-Factors" (keyConstituents).
      
      REQUIRED JSON STRUCTURE (Example):
      {
        "name": "Diet Coke",
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "confidence": 98,
        "servingSize": "1 Can",
        "keyConstituents": [
          { "label": "Caffeine", "value": "35mg", "type": "neutral" },
          { "label": "Sodium", "value": "40mg", "type": "bad" },
          { "label": "Aspartame", "value": "Yes", "type": "neutral" }
        ],
        "insight": "Hydrating but processed."
      }
      
      Your response must match this structure exactly.
      Assign 'type' as 'good' (nutrients), 'bad' (limiters), or 'neutral'.
    `;

    try {
        const imagePart = {
            inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg"
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        // DEBUG: Log the raw response to debug missing keys
        console.log("🤖 Gemini Raw Response:", text);

        const data = JSON.parse(text);

        // Ensure keyConstituents exists even if AI forgot it
        if (!data.keyConstituents) {
            data.keyConstituents = [];
        }

        return data;
    } catch (error) {
        console.error("Vision Analysis Failed:", error);
        return { name: "Error", calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
};

export const enhanceArticleContent = async (content: string, title?: string, category?: string): Promise<string> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
      Act as a highly qualified Nutritionist and PhD Scholar. 
      Your task is to rewrite the following article draft to be professional, evidence-based, yet warm, human, and accessible.
      
      Context:
      Title: ${title || 'Untitled'}
      Category: ${category || 'General Nutrition'}

      Guidelines:
      1. **Tone**: Authoritative (PhD level) but conversational and empathetic. Avoid overly stiff academic jargon, but use precise terminology where appropriate.
      2. **Structure**: Improve the flow/coherence. Use Markdown formatting (headings, bullet points, bold text) effectively.
      3. **Humanize**: Make it sound like a passionate expert talking to a client, not a robot.
      4. **CRITICAL CONSTRAINT**: Do **NOT** use em-dashes (—). Instead, use commas, colons, semicolons, or parentheses to connect thoughts. This is a strict style requirement.
      5. **Content**: Keep the original meaning and core points, but expand or clarify where necessary for better impact.
      
      Draft to Rewrite:
      "${content}"

      Output ONLY the rewritten Markdown content. Do not add conversational filler before or after.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Enhance Failed:", error);
        throw error;
    }
};

// ===== PERSONALIZED NUTRITION INSIGHTS =====

export interface NutritionInsight {
    title: string;
    detail: string;
    category: 'diet' | 'lifestyle' | 'timing' | 'supplement' | 'hydration';
    priority: 'high' | 'medium' | 'low';
}

export interface PersonalizedInsights {
    quickSummary: string;
    insights: NutritionInsight[];
    scientificBasis: string;
    timelineExpectation: string;
    relatedTopics: string[];
}

export const generateNutritionInsights = async (
    condition: string,
    symptoms: string[],
    deficiency?: string
): Promise<PersonalizedInsights> => {
    if (!API_KEY) throw new Error("API Key missing");

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

    const prompt = `
      You are a highly qualified nutritionist creating personalized, actionable wellness insights.
      
      USER CONTEXT:
      - Condition: ${condition}
      - Symptoms: ${symptoms.join(", ")}
      ${deficiency ? `- Potential Deficiency: ${deficiency}` : ''}
      
      CRITICAL REQUIREMENTS:
      1. **Hyper-Personalization**: Reference their EXACT symptoms in your recommendations. Don't be generic.
      2. **Specificity**: Give numbers, times, portions. "500ml water 30 min before meals" NOT "drink water regularly"
      3. **Actionability**: Every tip must have a clear, immediate action step
      4. **Scientific Credibility**: Mention mechanisms briefly (e.g., "increases iron absorption by 40%")
      5. **Warmth**: Write like a caring expert, not a robot
      
      Generate 4-6 diverse insights covering:
      - Diet adjustments (specific foods/portions)
      - Timing strategies (when to eat/drink)
      - Lifestyle changes (sleep, stress, movement)
      - Hydration tactics (amounts, timing, additions)
      - Supplement guidance (if relevant, with dosage ranges)
      
      Output strictly VALID JSON:
      {
        "quickSummary": "2-3 sentence overview connecting their symptoms to root causes",
        "insights": [
          {
            "title": "Short, Action-Oriented Title",
            "detail": "Detailed advice with specific numbers, timing, examples. Reference their symptoms. 2-4 sentences.",
            "category": "diet" | "lifestyle" | "timing" | "supplement" | "hydration",
            "priority": "high" | "medium" | "low"
          }
        ],
        "scientificBasis": "2-3 sentences explaining the science behind these recommendations in accessible language",
        "timelineExpectation": "When they might notice improvements (e.g., '3-5 days for energy, 2-3 weeks for full recovery')",
        "relatedTopics": ["Related Topic 1", "Related Topic 2", "Related Topic 3"]
      }
      
      EXAMPLES OF GOOD vs BAD:
      ❌ BAD: "Drink more water" 
      ✅ GOOD: "Drink 500ml water 30 minutes before each meal. Your dizziness symptoms suggest mild dehydration, which reduces blood volume by up to 400ml."
      
      ❌ BAD: "Eat balanced meals"
      ✅ GOOD: "Pair 150g complex carbs (quinoa, oats) with 120g protein at lunch. This prevents the post-meal blood sugar crashes causing your 2 PM fatigue."
      
      Do NOT return code blocks. Return ONLY the JSON string.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error("Nutrition Insights Generation Failed:", error);
        throw error;
    }
};
