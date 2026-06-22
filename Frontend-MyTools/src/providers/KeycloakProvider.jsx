import { createContext, useContext, useEffect, useState } from "react";
import { initKeycloak, getToken, login, logout } from "../keycloak";
import { profileService } from "../services/profileService";

const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return {}; }
};

const toUser = (token, profile = {}) => {
  const claims = token ? parseJwt(token) : {};
  return {
    id: claims.sub,
    username: profile.username || claims.preferred_username || claims.name || claims.email || "User",
    email: profile.email || claims.email || "",
    first_name: profile.firstName || claims.given_name || "",
    last_name: profile.lastName || claims.family_name || "",
    bio: profile.bio || "",
    phone: profile.phone || "",
    city: profile.city || "",
    address: profile.address || "",
    role: claims.realm_access?.roles?.includes("tools-admin") ? "admin" : claims.realm_access?.roles?.includes("StoreOwner") ? "StoreOwner" : "user",
  };
};

const formDataToProfilePayload = (data) => {
  if (!(data instanceof FormData)) return data;
  return {
    username: data.get("username") || "",
    firstName: data.get("first_name") || "",
    lastName: data.get("last_name") || "",
    bio: data.get("bio") || "",
  };
};

const KeycloakContext = createContext({
  initialized: false,
  authenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  refreshUserProfile: async () => {},
  updateProfile: async () => ({ success: false }),
});

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const refreshUserProfile = async (currentToken = getToken()) => {
    if (!currentToken) return null;
    try {
      const res = await profileService.getProfile();
      const merged = toUser(currentToken, res.data || {});
      setUser(merged);
      return merged;
    } catch {
      const fallback = toUser(currentToken);
      setUser(fallback);
      return fallback;
    }
  };

  const updateProfile = async (payload) => {
    try {
      const res = await profileService.updateProfile(formDataToProfilePayload(payload));
      const currentToken = getToken();
      setUser(toUser(currentToken, res.data || {}));
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err?.response?.data || "Failed to update profile" };
    }
  };

  useEffect(() => {
    initKeycloak()
      .then((keycloak) => {
        const currentToken = getToken();
        setInitialized(true);
        setAuthenticated(Boolean(keycloak.authenticated));
        setToken(currentToken);
        if (keycloak.authenticated) refreshUserProfile(currentToken);

        keycloak.onAuthSuccess = () => {
          const freshToken = getToken();
          setAuthenticated(true);
          setToken(freshToken);
          refreshUserProfile(freshToken);
        };

        keycloak.onAuthLogout = () => {
          setAuthenticated(false);
          setToken(null);
          setUser(null);
        };

        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).then(() => {
            const freshToken = getToken();
            setToken(freshToken);
            setUser((prev) => ({ ...toUser(freshToken), ...(prev || {}) }));
          });
        };
      })
      .catch(console.error);
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={{ initialized, authenticated, token, user, login, logout, refreshUserProfile, updateProfile }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);
