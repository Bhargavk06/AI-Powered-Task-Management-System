// NotificationProvider.js

import { createContext, useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useAuth } from './context/AuthContext'; // 1. IMPORT THE AUTH HOOK

export const NotificationContext = createContext();

// 2. No longer needs userId as a prop. Just takes `children`.
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef([]);
  
  // 3. Get the user object from our context.
  // This `user` object will be `null` if not logged in, or { userId, role, ... } if logged in.
  const { user } = useAuth();

  useEffect(() => {
    // 4. Get the userId from the context's user object.
    const userId = user?.userId; // Using optional chaining `?.` is safe if user is null.

    if (!userId) {
      // This now correctly handles the case where the user is logged out.
      console.log('No user logged in, notifications are disabled.');
      return; // Stop here if there's no user.
    }

    console.log('User is logged in. Initializing notifications for userId:', userId);
    
    // The rest of your code remains exactly the same!
    notificationsRef.current = notifications;

    const fetchNotifications = async () => { 
      try {
        const response = await axios.get(`http://localhost:8080/api/notifications/user/${userId}`);
        console.log(' Initial notifications fetched:', response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching initial notifications:', error.response || error);
      }
    };
    fetchNotifications();

    const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe(`/topic/user/${userId}`, async (message) => {
          console.log('Raw message body:', message.body);
          try {
            const notification = JSON.parse(message.body);
            console.log('Parsed notification:', notification);

            if (!notification.message || !notification.receiverId) {
              console.warn(' Invalid notification format:', notification);
              return;
            }

            const type = notification.type || (notification.message.toLowerCase().includes('comment') ? 'comment' : 'task');
            const typedNotification = {
              ...notification,
              id: notification.id || `${notification.receiverId}-${notification.timestamp || Date.now()}`,
              type,
              timestamp: notification.timestamp || new Date().toISOString(),
              read: notification.read ?? false,
            };

            const isDuplicate = notificationsRef.current.some(
              (n) => n.id === typedNotification.id
            );

            if (!isDuplicate) {
              setNotifications([typedNotification, ...notificationsRef.current]);
              try {
                await axios.post('http://localhost:8080/api/notifications/save', {
                  id: typedNotification.id,
                  senderId: notification.senderId || 'system',
                  receiverId: notification.receiverId,
                  message: notification.message,
                  type: typedNotification.type,
                  timestamp: typedNotification.timestamp,
                  read: typedNotification.read,
                }).then(response => {
                  console.log('Notification saved:', response.data);
                }).catch(error => {
                  console.error(' Error saving notification:', error.response || error);
                });
              } catch (e) {
                console.error('Error in POST request:', e);
              }
            } else {
              console.log('Duplicate notification ignored:', typedNotification.id);
            }
          } catch (e) {
            console.error('Error parsing notification:', e, message.body);
          }
        });
      },
      onStompError: (error) => {
        console.error(' STOMP error:', error);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
      onWebSocketClose: () => {
        console.log('WebSocket disconnected');
      },
    });

    client.activate();
    return () => client.deactivate();

  // 5. The effect now depends on the `user` object.
  // It will automatically re-run when the user logs in or logs out.
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};