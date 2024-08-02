import { BACKEND_URL } from "./constants/urls";
import React, { useState, useContext, createContext } from 'react';

const TOKEN_KEY = 'token';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(TOKEN_KEY));
  
  async function fetchProtectedData(endpoint, data) {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  }

  async function login(username, password) {
    if (!username || !password) {
      throw new Error('Invalid username or password');
    }
    if (isAuthenticated)
      return;
    
    const response = await fetch(`${BACKEND_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response) {
      throw new Error('Login failed, try again later');
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setIsAuthenticated(true);
    return data;
  }

  async function signup(username, password) {
    if (!username || !password) {
      throw new Error('Invalid username or password');
    }
    if (isAuthenticated)
      return;

    const response = await fetch(`${BACKEND_URL}signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    
    if (!response) {
      throw new Error('Registration failed');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors.username ?? 'Registration failed');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setIsAuthenticated(true);
    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ login, signup, logout, fetchProtectedData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}