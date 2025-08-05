import { createContext, useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ userId, children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef([]);
  

  useEffect(() => {
    if (!userId) {
      console.log(' No userId provided');
      return;
    }
    console.log('userId:', userId);
    notificationsRef.current = notifications;

    // Fetch initial notifications
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
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};