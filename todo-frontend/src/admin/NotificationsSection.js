import React, { useContext, useEffect, useState, useRef } from 'react';
import { NotificationContext } from '../NotificationProvider';

function NotificationsSection() {
  const { notifications } = useContext(NotificationContext);
  const userId = localStorage.getItem('userId')?.toString();
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef(null);

  console.log('userId from localStorage:', userId);
  console.log('All notifications from context:', notifications);
  console.log("Notification sample:", notifications[0]);


  // Relaxed filter to debug
  const filteredNotifications = notifications.filter(
    (n) =>
      String(n.receiverId) === String(userId) &&
      (n.read ?? false) !== true &&
      (n.type === 'task' || n.type === 'comment')
  );
  console.log('Filtered notifications:', filteredNotifications);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div
        ref={bellRef}
        style={{ position: 'relative', cursor: 'pointer', float: 'right', marginBottom: '10px' }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {filteredNotifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-10px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px'
          }}>
            {filteredNotifications.length}
          </span>
        )}
      </div>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '60px',
          width: '320px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          padding: '10px'
        }}>
          <h4 style={{ marginTop: 0 }}>Notifications</h4>
          {filteredNotifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            filteredNotifications.map((note, index) => {
              const isComment = note.type === 'comment' || note.message.toLowerCase().includes('comment');
              return (
                <div key={index} style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: isComment ? '#f0f9ff' : '#fffbe6',
                  borderLeft: `5px solid ${isComment ? '#1890ff' : '#faad14'}`,
                  borderRadius: '5px',
                  fontSize: '14px'
                }}>
                  <p>
                    <span style={{ marginRight: '8px' }}>
                      {isComment ? '🗨️' : '🔔'}
                    </span>
                    {note.message}
                  </p>
                  <small style={{ color: '#888' }}>
                    {new Date(note.timestamp).toLocaleString()}
                  </small>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsSection;