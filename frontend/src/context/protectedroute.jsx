import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Si l'utilisateur n'est pas connecté, redirige vers /login
    return <Navigate to="/Login" replace />;
  }

  return children;
};