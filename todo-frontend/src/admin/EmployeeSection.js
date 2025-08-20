import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/profile/employees')
      .then(response => {
        if (Array.isArray(response.data)) {
          setAllEmployees(response.data);
        } else {
          console.error("API returned non-array:", response.data);
          setAllEmployees([]);
        }
      })
      .catch(error => {
        console.error("Fetching error:", error);
      });
  }, []);

  const filteredEmployees = allEmployees.filter((employee) =>
    employee.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (employeeId) => {
    navigate(`/assignTask/${employeeId}`, {
      state: { from: { path: '/admintodo', section: 'Employees' } }
    });
  };

  const handleDelete = (e, employeeId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios.delete(`http://localhost:8080/profile/user/${employeeId}`)
        .then(() => {
          setAllEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        })
        .catch(error => {
          console.error("Delete failed:", error);
          alert("Failed to delete employee");
        });
    }
  };

  return (
    <div style={styles.container}>
      <h2>Employee Section</h2>

      <input
        type="text"
        placeholder="Search for Employees"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.listContainer}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              style={styles.card}
              onClick={() => handleClick(employee.id)}
            >
              <h4>{employee.username}</h4>
              <p>Email: {employee.profile?.email}</p>
              <p>Phone: {employee.profile?.phone}</p>

              <button
                style={styles.deleteButton}
                onClick={(e) => handleDelete(e, employee.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100%', // Fill available height
    display: 'flex',
    flexDirection: 'column',
  },
  searchInput: {
    padding: '10px',
    width: '60%',
    fontSize: '16px',
    marginTop: '10px',
  },
  listContainer: {
    marginTop: '20px',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '10px',
    maxHeight: '70vh', // Or adjust as needed
  },
  card: {
    position: 'relative',
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    background: '#fff',
  },
  deleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default EmployeeSection;
