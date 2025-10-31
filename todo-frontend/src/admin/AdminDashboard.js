import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
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
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}></div>
      <div style={styles.header}>Admin Dashboard</div>
      {/* Use Link for navigation, which is the standard in react-router */}
      <Link to="/admin" style={styles.link}>Home</Link>
      <Link to="/admin/managers" style={styles.link}>Managers</Link>
      <Link to="/admin/employees" style={styles.link}>Employees</Link>
      <Link to="/admin/projects" style={styles.link}>Projects</Link>
      <Link to="/admin/task-recommender" style={styles.link}>Task Recommender</Link>
      <Link to="/admin/task-summary" style={styles.link}>Task Summary</Link>
      <Link to="/admin/notifications" style={styles.link}>Notifications</Link>
      {/* Logout is an action, so using a button is more appropriate */}
      <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;