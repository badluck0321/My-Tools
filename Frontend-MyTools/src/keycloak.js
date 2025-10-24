import Keycloak from 'keycloak-js';

class KeycloakService {
  constructor() {
    this.keycloak = null;
    this.initialized = false;
    this.initPromise = null;
  }

  init(config) {
    // If already initialized, return the existing instance
    if (this.initialized) {
      return Promise.resolve(this.keycloak);
    }

    // If initialization is in progress, return the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.keycloak = new Keycloak(config);
    
    this.initPromise = this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      this.initialized = true;
      console.log('Keycloak initialized successfully. Authenticated:', authenticated);
      return this.keycloak;
    })
    .catch((error) => {
      console.error('Keycloak initialization failed:', error);
      this.initPromise = null; // Reset so we can retry
      throw error;
    });

    return this.initPromise;
  }

  getInstance() {
    if (!this.keycloak) {
      throw new Error('Keycloak not initialized. Call init() first.');
    }
    return this.keycloak;
  }

  isInitialized() {
    return this.initialized;
  }

  // Add these helper methods for better API
  login() {
    return this.keycloak.login();
  }

  logout() {
    return this.keycloak.logout();
  }

  getToken() {
    return this.keycloak?.token;
  }
}

// Create a singleton instance ✅ THIS IS THE MISSING CONNECTION
const keycloakService = new KeycloakService();

// Configuration
const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'myrealm',
  clientId: 'frontend-mytools',
};

// Export initialization function ✅ NOW USING keycloakService INSTANCE
export const initKeycloak = (onAuthenticatedCallback) => {
  return keycloakService.init(keycloakConfig)  // ✅ Using the instance
    .then((keycloak) => {
      if (keycloak.authenticated && onAuthenticatedCallback) {
        onAuthenticatedCallback();
      }
      return keycloak;
    });
};

// Export keycloak instance getter ✅ NOW USING keycloakService INSTANCE
export const getKeycloakInstance = () => {
  return keycloakService.getInstance();  // ✅ Using the instance
};

// Export additional helper methods ✅ USING keycloakService INSTANCE
export const login = () => keycloakService.login();
export const logout = () => keycloakService.logout();
export const getToken = () => keycloakService.getToken();
export const isInitialized = () => keycloakService.isInitialized();

export default getKeycloakInstance;
