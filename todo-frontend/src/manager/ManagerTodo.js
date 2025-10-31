import React, { useState} from 'react';
import { Outlet } from 'react-router-dom';
import ManagerDashboard from './ManagerDashboard';
import { NotificationProvider } from '../NotificationProvider';
import { useAuth } from '../context/AuthContext';

function ManagerTodo() {
  const { user } = useAuth();
  return (
   <NotificationProvider userId={user?.userId}>
      <div style={styles.wrapper}>
        <div>
          <ManagerDashboard />
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
    overflowY: 'auto',   // Controls scroll bar
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
};

export default ManagerTodo;
