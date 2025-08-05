import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((note, idx) => (
            <li key={idx} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <p>{note.message}</p>
              <small>{new Date(note.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
