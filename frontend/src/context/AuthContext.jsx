import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('waterwatch_user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'officer-01',
      email: 'officer@test.com',
      name: 'Nimal Jayasinghe (Water Supply Officer)',
      role: 'officer'
    };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('waterwatch_token') || 'demo-officer-token';
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('waterwatch_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('waterwatch_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('waterwatch_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('waterwatch_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      // Fallback local auth for demo resilience
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
    localStorage.removeItem('waterwatch_token');
    localStorage.removeItem('waterwatch_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isOfficer: user?.role === 'officer' || user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
