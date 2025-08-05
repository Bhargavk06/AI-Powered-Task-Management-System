import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard(props) {
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
    },
  };

  const handleNavigation = (section) => {
    props.setSelectedSection && props.setSelectedSection(section);
  };

  const handleLogout = () => {
    navigate('/UserLogin');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}></div>
      <div style={styles.header}>Admin Dashboard</div>
      <div style={styles.link} onClick={() => handleNavigation('Home')}>Home</div>
      <div style={styles.link} onClick={() => handleNavigation('Managers')}>Managers</div>
      <div style={styles.link} onClick={() => handleNavigation('Employees')}>Employees</div>
      <div style={styles.link} onClick={() => handleNavigation('TaskRecommender')}>TaskRecommender</div>
      <div style={styles.link} onClick={() => handleNavigation('Task Summary')}>Task Summary</div>
      <div style={styles.link} onClick={() => handleNavigation('Notifications')}>Notifications</div>
      <div style={styles.link} onClick={handleLogout}>Logout</div>
    </div>
  );
}

export default AdminDashboard;


/*
React Functional Component:
AdminDashboard is a stateless functional component written using ES6 arrow functions and useNavigate() hook for navigation.
Functional components are the modern standard in React, and they support hooks.

useNavigate() from react-router-dom:
This is a React Router v6 hook that lets you programmatically navigate to a different route (in this case, /UserLogin on logout).
It replaces the old history.push() used in v5. It only works inside a component that’s rendered within a <BrowserRouter>.

Props usage (props.setSelectedSection):
props stands for properties. It is the standard way to pass data from a parent component to a child component in React.
The component receives a setSelectedSection function from its parent to dynamically switch views (like showing Home, Managers, Employees etc.).
This shows parent-to-child communication and state lifting.

Inline CSS Styling:
The styles object defines CSS-in-JS styling.
This is useful when styles are component-specific, and avoids external CSS files.
The sidebar uses Flexbox (display: 'flex', flexDirection: 'column') to stack items vertically.

JSX & Styling (style={styles.sidebar}):
JSX is used to render HTML-like syntax in JavaScript.
Here, the sidebar layout is built using JSX and style props apply custom inline styles.

Event Handling (onClick):
Each sidebar link has an onClick event that triggers a function.
Either it calls handleNavigation() with a section name or handleLogout() to navigate to login.
This demonstrates React’s event binding and UI interactivity.

Routing Control via State:
Clicking any link sets a section via props — the parent will likely use that to conditionally render components (like a dynamic dashboard).
This is a common technique in React dashboards.

Clean UI Layout:
The layout includes a title (ACM), header (Admin Dashboard), and interactive links that simulate a sidebar navigation system — a standard pattern in admin panels.

*/