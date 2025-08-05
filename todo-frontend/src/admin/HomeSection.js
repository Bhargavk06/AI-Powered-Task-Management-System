import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomeSection() {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);

  useEffect(() => {
    // Fetch Employees
    axios.get('http://localhost:8080/profile/employees')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEmployeeCount(response.data.length);
        } else {
          console.error('Employees API did not return an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });

    // Fetch Managers
    axios.get('http://localhost:8080/profile/managers')
      .then(response => {
        if (Array.isArray(response.data)) {
          setManagerCount(response.data.length);
        } else {
          console.error('Managers API did not return an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching managers:', error);
      });
  }, []); // Runs once when component mounts

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard Home</h1>
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Employees</h2>
          <p style={styles.count}>{employeeCount}</p>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Managers</h2>
          <p style={styles.count}>{managerCount}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '40px',
    color: '#2c3e50'
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '200px',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    fontSize: '20px',
    color: '#34495e',
    marginBottom: '10px',
  },
  count: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#27ae60',
  },
};

export default HomeSection;
