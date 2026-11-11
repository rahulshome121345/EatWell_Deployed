import { type Article } from './db';

/**
 * Intelligent content matcher that finds relevant expert articles
 * based on user's condition and symptoms with fuzzy matching
 */

// Simple Levenshtein distance for fuzzy string matching
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

function similarityScore(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const distance = levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
}

interface MatchResult {
    article: Article;
    confidence: number;
    matchReasons: string[];
}

export const findMatchingArticle = (
    condition: string,
    symptoms: string[],
    articles: Article[]
): MatchResult | null => {
    if (articles.length === 0) return null;

    const conditionLower = condition.toLowerCase();
    const symptomsLower = symptoms.map(s => s.toLowerCase());

    const scored = articles.map(article => {
        let score = 0;
        const matchReasons: string[] = [];

        // 1. Exact title match (highest priority - 40 points)
        if (article.title.toLowerCase().includes(conditionLower)) {
            score += 40;
            matchReasons.push('Title match');
        }

        // 2. Fuzzy title match (30 points if >70% similarity)
        const titleSimilarity = similarityScore(article.title, condition);
        if (titleSimilarity > 70) {
            score += 30;
            matchReasons.push(`Title similarity ${Math.round(titleSimilarity)}%`);
        }

        // 3. Tag intersection (10 points per matching tag)
        const articleTags = article.tags?.map(t => t.toLowerCase()) || [];
        const matchingTags = symptomsLower.filter(symptom =>
            articleTags.some(tag =>
                tag.includes(symptom) || symptom.includes(tag)
            )
        );
        if (matchingTags.length > 0) {
            score += matchingTags.length * 10;
            matchReasons.push(`${matchingTags.length} symptom tag matches`);
        }

        // 4. Keyword match in title or excerpt (5 points each)
        symptomsLower.forEach(symptom => {
            const titleMatch = article.title.toLowerCase().includes(symptom);
            const excerptMatch = article.excerpt?.toLowerCase().includes(symptom);
            if (titleMatch || excerptMatch) {
                score += 5;
                matchReasons.push(`Keyword: ${symptom}`);
            }
        });

        // 5. Category relevance (15 points if condition matches category)
        if (article.category && conditionLower.includes(article.category.toLowerCase())) {
            score += 15;
            matchReasons.push('Category match');
        }

        return {
            article,
            confidence: Math.min(score, 100), // Cap at 100%
            matchReasons
        };
    });

    // Sort by confidence descending
    scored.sort((a, b) => b.confidence - a.confidence);

    // Return best match if confidence >= 40%
    const bestMatch = scored[0];
    if (bestMatch.confidence >= 40) {
        return bestMatch;
    }

    return null;
};

/**
 * Get related articles based on tags and category
 */
export const getRelatedArticles = (
    symptoms: string[],
    category: string,
    articles: Article[],
    limit: number = 3
): Article[] => {
    const symptomsLower = symptoms.map(s => s.toLowerCase());

    const scored = articles.map(article => {
        let score = 0;

        // Tag overlap
        const articleTags = article.tags?.map(t => t.toLowerCase()) || [];
        const overlap = symptomsLower.filter(s =>
            articleTags.some(tag => tag.includes(s) || s.includes(tag))
        ).length;
        score += overlap * 10;

        // Same category
        if (article.category === category) {
            score += 20;
        }

        return { article, score };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.article);
};
