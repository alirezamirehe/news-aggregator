export const API_KEYS = {
    NEWSAPI: import.meta.env.VITE_NEWS_API_KEY || '',
    GUARDIAN: import.meta.env.VITE_GUARDIAN_API_KEY || '',
    NYTIMES: import.meta.env.VITE_NY_TIMES_API_KEY || ''
} as const;

export const API_ENDPOINTS = {
    NEWSAPI: import.meta.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2',
    GUARDIAN: '/guardian-api',
    NYTIMES: import.meta.env.VITE_NY_TIMES_API_URL || 'https://api.nytimes.com/svc'
} as const;

// Get current date time in UTC
const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
};

export const DEFAULT_CONTEXT = {
    currentDateTime: getCurrentDateTime(),
    username: 'alirezamirehe'
} as const;

// Adds type safety for environment variables
declare global {
    interface ImportMetaEnv {
        readonly VITE_NEWS_API_KEY: string;
        readonly VITE_NEWS_API_URL: string;
        readonly VITE_GUARDIAN_API_KEY: string;
        readonly VITE_GUARDIAN_API_URL: string;
        readonly VITE_NY_TIMES_API_KEY: string;
        readonly VITE_NY_TIMES_API_URL: string;
    }
}