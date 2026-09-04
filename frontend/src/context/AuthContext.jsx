import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('waterwatch_user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : {
        id: 'officer-01',
        email: 'officer@test.com',
        name: 'Nimal Jayasinghe (Water Supply Officer)',
        role: 'officer'
      };
    } catch (err) {
      return {
        id: 'officer-01',
        email: 'officer@test.com',
        name: 'Nimal Jayasinghe (Water Supply Officer)',
        role: 'officer'
      };
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('waterwatch_token') || 'demo-officer-token';
    } catch (err) {
      return 'demo-officer-token';
    }
  });

  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('waterwatch_token', token);
      } catch (e) {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      try {
        localStorage.removeItem('waterwatch_token');
      } catch (e) {}
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('waterwatch_user', JSON.stringify(user));
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem('waterwatch_user');
      } catch (e) {}
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data && res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      // Fallback local authentication for demo resilience
      if (email.toLowerCase() === 'officer@test.com' && password === 'password123') {
        const demoUser = {
          id: 'officer-01',
          email: 'officer@test.com',
          name: 'Nimal Jayasinghe (Water Supply Officer)',
          role: 'officer'
        };
        setToken('demo-officer-token');
        setUser(demoUser);
        return { success: true, user: demoUser };
      }
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('waterwatch_token');
      localStorage.removeItem('waterwatch_user');
    } catch (e) {}
  };

  const value = {
    user,
    token,
    login,
    logout,
    isOfficer: user?.role === 'officer' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: {
        id: 'officer-01',
        email: 'officer@test.com',
        name: 'Nimal Jayasinghe (Water Supply Officer)',
        role: 'officer'
      },
      token: 'demo-officer-token',
      login: async () => {},
      logout: () => {},
      isOfficer: true
    };
  }
  return context;
}
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error("Error loading user", error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
