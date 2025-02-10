export const ENV = {
    NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY || '',
    NEWS_API_URL: import.meta.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2',
    GUARDIAN_API_KEY: import.meta.env.VITE_GUARDIAN_API_KEY || '',
    GUARDIAN_API_URL: import.meta.env.VITE_GUARDIAN_API_URL || 'https://content.guardianapis.com',
    NY_TIMES_API_KEY: import.meta.env.VITE_NY_TIMES_API_KEY || '',
    NY_TIMES_API_URL: import.meta.env.VITE_NY_TIMES_API_URL || 'https://api.nytimes.com/svc',
} as const;

// Validates environment variables
const requiredEnvVars = ['NEWS_API_KEY'] as const;
for (const envVar of requiredEnvVars) {
    if (!ENV[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}