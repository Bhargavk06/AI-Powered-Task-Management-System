import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import AdminDashboard from './AdminDashboard';
import { NotificationProvider } from '../NotificationProvider';
import { useAuth } from '../context/AuthContext';

function AdminTodo() {
  const { user } = useAuth();
  return (
  
    <NotificationProvider userId={user?.userId}>
      <div style={styles.wrapper}>
        <div>
          <AdminDashboard />
        </div>
        <div style={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    </NotificationProvider>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  mainContent: {
    flex: 1,
    height: '100vh',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
};

export default AdminTodo;