import React from 'react';
import {useNavigate} from 'react-router-dom';
function ManagerDashboard(props) {
  const navigate = useNavigate();
  const styles = {
    sidebar: {
      width: '250px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      paddingTop: '10px',
      fontSize: '28px',
      fontWeight: 'bold',
    },
    header: {
      textAlign: 'center',
      padding: '20px 0',
      fontSize: '22px',
      borderBottom: '1px solid #34495e',
    },
    link: {
      padding: '15px 20px',
      color: 'white',
      textDecoration: 'none',
      borderBottom: '1px solid #34495e',
      transition: 'background-color 0.3s',
      cursor: 'pointer',
    },
    linkHover: {
      backgroundColor: '#34495e',
    },
  };

  const handleNavigation = (section) => {
    // TODO: Handle navigation (e.g., useNavigate or props)
    props.setSelectedSection(section);
  };

  const handleLogout=()=>{
    navigate('/UserLogin');
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}>ACM</div>
      <div style={styles.header}>Manager Dashboard</div>
      <div style={styles.link} onClick={() => handleNavigation('Home')}>Home</div>
      <div style={styles.link} onClick={() => handleNavigation('Employees')}>Employees</div>
      <div style={styles.link} onClick={() => handleNavigation('Task Summary')}>Task Summary</div>
      <div style={styles.link} onClick={() => handleNavigation('Notifications')}>Notifications</div>
      <div style={styles.link} onClick={() => handleLogout('Logout')}>Logout</div>
    </div>
  );
}
export default ManagerDashboard;
