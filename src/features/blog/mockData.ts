export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        credentials: string;
        image?: string;
    };
    category: string;
    readTime: string;
    publishedAt: string;
    imageUrl: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        slug: 'understanding-macro-balance',
        title: 'The Science of Macro Balance: Beyond Counting Calories',
        excerpt: 'Why the ratio of protein, fats, and carbohydrates matters more than just the energy total. An expert deep dive.',
        content: `
# The Science of Macro Balance

Calories differ in their metabolic effects. While a calorie is a unit of energy, the hormonal response to 100 calories of sugar versus 100 calories of salmon is vastly different.

## Protein and TEF
Protein has a high Thermic Effect of Food (TEF), meaning your body burns about 20-30% of the calories just digesting it.

## The Insulin Response
Carbohydrates, especially simple ones, spike insulin. Chronically high insulin can block fat burning.

*This content is reviewed by Arunima Dhar, Research Scholar, IIT Guwahati.*
        `,
        author: {
            name: 'Arunima Dhar',
            credentials: 'Research Scholar, IIT Guwahati',
        },
        category: 'Nutrition Basics',
        readTime: '5 min read',
        publishedAt: 'Oct 15, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2070'
    },
    {
        id: '2',
        slug: 'micronutrients-deficiency-signs',
        title: 'Hidden Hunger: 5 Signs of Micronutrient Deficiency',
        excerpt: 'Feeling tired? It might not just be sleep. Learn how magnesium, iron, and B12 variances affect your daily energy.',
        content: '...',
        author: {
            name: 'Arunima Dhar',
            credentials: 'Research Scholar, IIT Guwahati',
        },
        category: 'Clinical Health',
        readTime: '7 min read',
        publishedAt: 'Oct 10, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2070'
    },
    {
        id: '3',
        slug: 'gut-health-immunity',
        title: 'The Gut-Immunity Axis',
        excerpt: '70% of your immune system lives in your gut. Here is how fiber and probiotics build your defense shield.',
        content: '...',
        author: {
            name: 'Arunima Dhar',
            credentials: 'Research Scholar, IIT Guwahati',
        },
        category: 'Immunity',
        readTime: '6 min read',
        publishedAt: 'Sep 28, 2025',
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2070'
    }
];
