import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useKeycloak } from "../providers/KeycloakProvider";
import { publicRoutes, protectedRoutes } from "./routeConfig.jsx";

const ProtectedRoute = ({ children }) => {
  const { initialized, authenticated, login } = useKeycloak();

  useEffect(() => {
    if (initialized && !authenticated) {
      login(); // ✅ side effect
    }
  }, [initialized, authenticated, login]);

  if (!initialized) return null;
  if (!authenticated) return null;

  return children;
};

const AppRoutes = () => {
  const { initialized } = useKeycloak();

  if (!initialized) {
    return <p>Loading authentication...</p>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              {element}
            </ProtectedRoute>
          }
        />
      ))}

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="container-custom py-20 text-center">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
