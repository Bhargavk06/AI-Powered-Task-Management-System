import React, { useState} from 'react';
import ManagerDashboard from './ManagerDashboard';
import EmployeeSection from '../admin/EmployeeSection';
import TaskSummarySection from './ManagerTasks';

function ManagerTodo() {
  const [selectedSection, setSelectedSection] = useState('');
  return (
    <div style={styles.wrapper}>
      {/* Left Sidebar */}
      <div>
        <ManagerDashboard setSelectedSection={setSelectedSection} />
      </div>

      {/* Right Content */}
      <div style={styles.mainContent}>
        {selectedSection === "Home" && ( <h2>Welcome, Manager</h2>) }
        {selectedSection === "Employees" && <EmployeeSection />}
        {selectedSection === "Task Summary" && <TaskSummarySection />}
     

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
};

export default ManagerTodo;
