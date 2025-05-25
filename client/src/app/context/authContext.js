"use client"
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('loggedInEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Add your login function here
  const login = async (email, password) => {
    // Example: mock login logic (replace with real API call)
    if (email && password) {
      // Save login status locally
      localStorage.setItem('loggedInEmail', email);
      setEmail(email);
      return true;  // success
    }
    return false;  // fail
  };

  return (
    <AuthContext.Provider value={{ email, setEmail, login }}>
      {children}
    </AuthContext.Provider>
  );
};
