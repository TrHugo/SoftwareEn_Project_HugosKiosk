import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // CORRECTION 1 : "Lazy Initialization"
  // Au lieu d'utiliser useEffect, on passe une fonction à useState.
  // React va exécuter ça une seule fois au démarrage. C'est beaucoup plus propre.
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// CORRECTION 2 : On dit à ESLint d'ignorer l'avertissement de refresh pour cette ligne
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);