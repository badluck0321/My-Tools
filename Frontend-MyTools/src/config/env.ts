/// <reference types="vite/client" />

export const env = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
    // Add other env-derived configs here
};

// Optional: validate at startup
if (!env.apiBaseUrl) {
    throw new Error('❌ VITE_API_BASE_URL is missing in environment!');
}