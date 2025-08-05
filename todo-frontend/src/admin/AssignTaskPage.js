import React from 'react';
import { useParams } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AssignTask from './AssignTask';

export default function AssignTaskPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AdminDashboard setSelectedSection={() => {}} />

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#f4f4f4',
      }}>
        <AssignTask />
      </div>
    </div>
  );
}
