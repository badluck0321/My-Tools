/// <reference types="vite/client" />

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
  keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080/',
  keycloakRealm: import.meta.env.VITE_KEYCLOAK_REALM || 'myrealm',
  keycloakClientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-mytools',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
};
