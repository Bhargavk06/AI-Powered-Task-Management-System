// src/notifications/NotificationProvider.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // --- THIS IS THE CORRECTED LOGIC ---

  // We no longer need useCallback for this simple fetch.
  const fetchNotifications = () => {
    // The check for the user happens right when the function is called.
    if (!user || !user.userId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    axios.get(`http://localhost:8080/api/notifications/user/${user.userId}`)
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => console.error("Error fetching notifications:", error))
      .finally(() => setIsLoading(false));
  };
  
  // The useEffect now directly depends on the 'user' object.
  // This is the cleanest and most reliable pattern.
  useEffect(() => {
    fetchNotifications();
  }, [user]); // <-- Re-run this effect WHENEVER the 'user' object changes.

  const markAllAsRead = () => {
    if (!user || !user.userId) return;

    // This function is correct. It calls fetchNotifications after success.
    return axios.post(`http://localhost:8080/api/notifications/mark-all-as-read/${user.userId}`)
      .then(() => {
        fetchNotifications();
      })
      .catch(error => {
          console.error("Error marking all as read:", error)
          throw error; // Re-throw to inform the caller of the failure if needed
      });
  };
  
  const markOneAsRead = (notificationId) => {
    // This optimistic update logic is also correct.
    const originalNotifications = notifications;
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));

    return axios.post(`http://localhost:8080/api/notifications/mark-as-read/${notificationId}`)
      .catch(error => {
        console.error("Failed to mark one as read, reverting:", error);
        setNotifications(originalNotifications); // Revert on failure
        throw error;
      });
  };

  const value = {
    notifications,
    isLoading,
    markAllAsRead,
    markOneAsRead,
    unreadCount: notifications.filter(n => !n.isRead).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};