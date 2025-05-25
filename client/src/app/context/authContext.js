"use client"
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmailState] = useState(null);
  // Add state for loading initial email from localStorage
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // This effect runs only on the client-side after initial render
    const savedEmail = localStorage.getItem('userEmail'); // Use consistent key
    if (savedEmail) {
      setUserEmailState(savedEmail);
    }
    setIsInitialLoad(false); // Mark initial load as complete
  }, []);

  // Function to set user email and update localStorage
  const setUserEmail = (email) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  };

  // We can keep the placeholder login or remove it if authentication is handled elsewhere
  // Removing placeholder login for now to focus on email state management
  // const login = async (email, password) => { ... };

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail, isInitialLoad }}>
      {children}
    </AuthContext.Provider>
  );
};
