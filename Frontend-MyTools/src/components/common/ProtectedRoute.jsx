import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common';

export const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Verifying authentication..." />;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  return !authenticated ? children : <Navigate to="/dashboard" replace />;
};
