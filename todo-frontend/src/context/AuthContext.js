// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This is correct - it rehydrates the user state on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- THIS IS THE CORRECTED LOGIN FUNCTION ---
  const login = (userData) => {
    // 1. Log what the login function receives from UserAuthPage
    console.log("AuthContext: 'login' function received userData:", userData);

    if (userData && userData.userId) {
      // Create the final object to be stored
      const userToStore = {
        userId: userData.userId,
        username: userData.username,
        role: userData.role,
      };

      // 2. Log exactly what is about to be saved
      console.log("AuthContext: Saving this object to localStorage:", userToStore);

      // 3. Save the full user object (for use within this context)
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      // 4. THIS IS THE FIX: Save the userId separately for other components to easily access
      localStorage.setItem('userId', userToStore.userId);

      // 5. Update the React state
      setUser(userToStore);
    } else {
      console.error("AuthContext: 'login' was called with invalid or missing userData.");
    }
  };

  // --- UPDATE THE LOGOUT FUNCTION TO BE COMPLETE ---
  const logout = () => {
    console.log("AuthContext: Clearing user data from localStorage.");
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // Also remove the separate userId
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    // It's safer to check user?.userId to ensure the object exists
    userId: user?.userId, 
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};