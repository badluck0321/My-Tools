import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { KeycloakProvider } from "./providers/KeycloakProvider.jsx";
import { ReactKeycloakProvider } from '@react-keycloak/web';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </StrictMode>
);

