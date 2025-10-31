import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ManagerDashboard() {
  const navigate = useNavigate();

  // STYLES OBJECT -- NOW WITH 'nav' and 'logout'
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
      position: 'sticky',
      top: 0,
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
      display: 'block', // To make the entire area clickable
    },
    logoutButton: {
      padding: '15px 20px',
      color: 'white',
      textDecoration: 'none',
      borderBottom: '1px solid #34495e',
      transition: 'background-color 0.3s',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left',
      width: '100%',
      fontSize: '16px', // Match link font size
      fontFamily: 'Arial, sans-serif', // Match link font family
    }
  };

  const handleLogout = () => {
    navigate('/UserLogin');
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}>ACM</div>
      <div style={styles.header}>Manager Dashboard</div>

      {/* This JSX will now work correctly */}
      <nav style={styles.nav}>
        <Link to="/manager" style={styles.link}>Home</Link>
        <Link to="/manager/employees" style={styles.link}>Employees</Link>
        <Link to="/manager/tasks" style={styles.link}>Task List</Link>
        <Link to="/manager/projects" style={styles.link}>Projects</Link>
        <Link to="/manager/task-summary" style={styles.link}>Task Summary</Link>
        
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}

export default ManagerDashboard;