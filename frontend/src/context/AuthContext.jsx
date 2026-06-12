import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kalren_user');

    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/api/auth/me');

      setUser(res.data);
      localStorage.setItem(
        'kalren_user',
        JSON.stringify(res.data)
      );
    } catch (err) {
      setUser(null);
      localStorage.removeItem('kalren_user');
      localStorage.removeItem('kalren_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('kalren_token');

    // kalau tidak ada token, jangan hit endpoint sama sekali
    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem('kalren_user');
      localStorage.removeItem('kalren_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);