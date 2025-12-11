import { createContext, useContext, useEffect, useState } from "react";
import { initKeycloak, getToken, login, logout } from "../keycloak";

const KeycloakContext = createContext({
  initialized: false,
  authenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const KeycloakProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initKeycloak()
      .then((keycloak) => {
        setInitialized(true);
        setAuthenticated(keycloak.authenticated);
        setToken(getToken());
      })
      .catch((err) => {
        console.error("Keycloak initialization failed:", err);
      });
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
    <KeycloakContext.Provider
      value={{ initialized, authenticated, token, login, logout }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloak = () => useContext(KeycloakContext);