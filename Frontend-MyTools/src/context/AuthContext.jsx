import React, { createContext, useContext, useState, useEffect } from "react";
import { initKeycloak, getKeycloakInstance } from "../keycloak";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(); // ← Add export here

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await initKeycloak(() => {
          if (!mounted) return;

          const keycloak = getKeycloakInstance();
          setAuthenticated(true);
          if (keycloak.tokenParsed) {
            setUser({
              username:
                keycloak.tokenParsed.preferred_username ||
                keycloak.tokenParsed.sub,
              email: keycloak.tokenParsed.email || "",
              roles: keycloak.tokenParsed.realm_access?.roles || [],
            });
          }
          setLoading(false);
        });

        // Check if we're authenticated after initialization
        const keycloak = getKeycloakInstance();
        if (!keycloak.authenticated && mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = () => {
    const keycloak = getKeycloakInstance();
    keycloak.login();
  };
  const signup = () => {
    const keycloak = getKeycloakInstance();
    // Start Keycloak registration flow. Use login with action 'register' which is supported by Keycloak JS.
    if (keycloak?.login) {
      try {
        return keycloak.login({ action: "register" });
      } catch (e) {
        // Fallback: try register() if available
        if (typeof keycloak.register === "function") {
          return keycloak.register();
        }
        console.error("Signup not supported by Keycloak instance:", e);
      }
    }
  };

  const logout = () => {
    const keycloak = getKeycloakInstance();
    // if (keycloak?.logout) {
    return keycloak.logout();
    // }
  };

  const getToken = () => {
    const keycloak = getKeycloakInstance();
    return keycloak.token;
  };

  const value = {
    authenticated,
    user,
    loading,
    login,
    signup,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
