import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('kalren_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data) {
        setUser({
          ...res.data,
          token
        });
      }
    } catch (err) {
      console.error('Gagal fetch session user dari DB Atlas:', err);

      localStorage.removeItem('kalren_token');
      localStorage.removeItem('kalren_role');

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('kalren_token');
    localStorage.removeItem('kalren_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchCurrentUser
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);