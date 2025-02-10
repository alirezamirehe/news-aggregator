/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_NEWS_API_KEY: string;
    readonly VITE_NEWS_API_URL: string;
    readonly VITE_GUARDIAN_API_KEY: string;
    readonly VITE_GUARDIAN_API_URL: string;
    readonly VITE_NY_TIMES_API_KEY: string;
    readonly VITE_NY_TIMES_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}