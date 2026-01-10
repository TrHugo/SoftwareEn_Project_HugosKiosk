import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Si l'objet user n'existe pas OU si le token est physiquement absent
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};