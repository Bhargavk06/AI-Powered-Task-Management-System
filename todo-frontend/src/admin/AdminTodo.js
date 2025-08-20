import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import HomeSection from './HomeSection';
import ManagerSection from './ManagerSection';
import EmployeeSection from './EmployeeSection';
import TaskRecommender from './TaskRecommender';
import TaskSummarySection from './TaskSummarySection';
import NotificationsSection from './NotificationsSection';
import { NotificationProvider } from '../NotificationProvider'; // ✅ make sure path is correct

function AdminTodo() {
  const [selectedSection, setSelectedSection] = useState('');
  const location = useLocation();
  const userId = localStorage.getItem('userId'); // ✅ needed for NotificationProvider

  useEffect(() => {
    if (location.state?.section) {
      setSelectedSection(location.state.section);
    }
  }, [location.state]);

  return (
    <NotificationProvider userId={userId}> {/* ✅ wrap entire dashboard */}
      <div style={styles.wrapper}>
        <div>
          <AdminDashboard setSelectedSection={setSelectedSection} />
        </div>

        <div style={styles.mainContent}>
          {selectedSection === "Home" && <HomeSection/>}
          {selectedSection === "Managers" && <ManagerSection />}
          {selectedSection === "Employees" && <EmployeeSection />}
          {selectedSection === "TaskRecommender" && <TaskRecommender />}
          {selectedSection === "Task Summary" && <TaskSummarySection />}
          {selectedSection === "Notifications" && <NotificationsSection />}
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
    height: '100vh',        // Main content takes full viewport height
    overflowY: 'auto',      // Main content scrolls vertically if content overflows
    padding: '20px',
    backgroundColor: '#f4f4f4',
  },
};

export default AdminTodo;