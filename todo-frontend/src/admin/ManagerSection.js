import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ManagerSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allManagers, setAllManagers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:8080/profile/managers')
      .then(response => {
        // ✅ Always ensure data is an array
        if (Array.isArray(response.data)) {
          setAllManagers(response.data);
        } else {
          console.error("API returned non-array:", response.data);
          setAllManagers([]);
        }
      })
      .catch(error => {
        console.error("Fetching error:", error);
      });
  }, []);

  // ✅ Filter only when data is loaded and is an array
  const filteredManagers = allManagers.filter((manager) =>
    manager.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (managerId) => {
    navigate(`/assignTask/${managerId}`);
  };

  const handleDelete = (e, managerId) => {
    e.stopPropagation(); // ❗ prevent parent click handler
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios.delete(`http://localhost:8080/profile/user/${managerId}`)
        .then(() => {
          // Remove manager from state
          setAllManagers(prev => prev.filter(mng => mng.id !== managerId));
        })
        .catch(error => {
          console.error("Delete failed:", error);
          alert("Failed to delete employee");
        });
    }
  };

  return (
    <div>
      <h2>Manager Section</h2>

      <input
        type="text"
        placeholder="Search for managers"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '60%', fontSize: '16px', marginTop: '10px' }}
      />

      <div style={{ marginTop: '20px' }}>
        {filteredManagers.length > 0 ? (
          filteredManagers.map((manager) => (
            <div
              key={manager.id}
              style={{
                border: '1px solid #ccc',
                padding: '20px',
                marginBottom: '10px',
                cursor: 'pointer',
                position: 'relative', // ✅ makes button's absolute positioning work
                borderRadius: '6px',
                background: '#fff',
              }}
              onClick={() => handleClick(manager.id)}
            >
              <h4>{manager.username}</h4>
              <p>Email: {manager.profile?.email}</p>
              <p>Phone: {manager.profile?.phone}</p>

              <button
                style={{
                  position: 'absolute',   // ✅ absolute, anchored by parent
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onClick={(e) => handleDelete(e, manager.id)}
              >
                Delete
              </button>
            </div>

          ))
        ) : (
          <p>No managers found.</p>
        )}
      </div>
    </div>
  );
}

export default ManagerSection;
