import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authenticateAdmin, getAdminByEmail } from '../utils/persistence';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('bocra_token');
        const storedUser = localStorage.getItem('bocra_user');

        if (storedToken && storedUser) {
          // Validate token with backend
          try {
            const response = await fetch(`${API_URL}/auth/validate`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              setToken(storedToken);
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('bocra_token');
              localStorage.removeItem('bocra_user');
              setUser(null);
              setToken(null);
            }
          } catch (err) {
            console.error('Token validation error:', err);
            localStorage.removeItem('bocra_token');
            localStorage.removeItem('bocra_user');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [API_URL]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      const { token: newToken, user: newUser } = data;

      localStorage.setItem('bocra_token', newToken);
      localStorage.setItem('bocra_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { token: newToken, user: newUser };
    } catch (err) {
      // Fallback for development if backend is down
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        console.warn('Backend connection refused. Using mock login flow for development.');
        
        // Try to authenticate as admin first
        const adminUser = authenticateAdmin(email, password);
        
        let mockUser;
        let mockToken = 'dev-token-' + Date.now();
        
        if (adminUser) {
          // Admin login successful
          mockUser = {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            userType: 'admin',
            adminLevel: adminUser.adminLevel,
            department: adminUser.department,
          };
        } else {
          // Fallback: create citizen user
          mockUser = {
            id: 'dev-user-id',
            email: email,
            name: email.split('@')[0] || 'Citizen',
            userType: 'citizen',
            tier: 'Tier 1 Citizen',
            trustScore: 82
          };
        }
        
        localStorage.setItem('bocra_token', mockToken);
        localStorage.setItem('bocra_user', JSON.stringify(mockUser));
        setToken(mockToken);
        setUser(mockUser);
        return { token: mockToken, user: mockUser };
      }
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const register = useCallback(async (email, password, name, userType, organization, department) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          userType,
          organization,
          department,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      const { token: newToken, user: newUser } = data;

      localStorage.setItem('bocra_token', newToken);
      localStorage.setItem('bocra_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { token: newToken, user: newUser };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const logout = useCallback(() => {
    localStorage.removeItem('bocra_token');
    localStorage.removeItem('bocra_user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
