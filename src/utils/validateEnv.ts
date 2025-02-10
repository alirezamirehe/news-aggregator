export const validateEnv = () => {
    const requiredEnvVars = [
        'VITE_NEWS_API_KEY',
        'VITE_NEWS_API_URL',
        'VITE_GUARDIAN_API_KEY',
        'VITE_GUARDIAN_API_URL',
        'VITE_NY_TIMES_API_KEY',
        'VITE_NY_TIMES_API_URL'
    ] as const;

    const missingVars = requiredEnvVars.filter(
        key => !import.meta.env[key]
    );

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}`
        );
    }
};