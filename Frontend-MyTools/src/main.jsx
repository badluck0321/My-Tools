import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { KeycloakProvider } from "./providers/KeycloakProvider.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </StrictMode>
);

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { initKeycloak } from './keycloak';

// // Optional: show a loading screen while Keycloak initializes
// const renderApp = () => {
//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <App />
//     </StrictMode>
//   );
// };

// // Initialize Keycloak before rendering
// initKeycloak()
//   .then(() => {
//     console.log('Keycloak ready, rendering App...');
//     renderApp();
//   })
//   .catch((err) => {
//     console.error('Keycloak initialization failed:', err);
//     // Optional: show an error screen
//     document.getElementById('root').innerHTML =
//       '<h1>Failed to initialize authentication</h1>';
//   });


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
