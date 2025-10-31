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

  const filteredManagers = allManagers.filter((manager) =>
    manager.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (managerId) => {
    navigate(`../assignTask/${managerId}`, {
      state: { from: { path: '/admintodo', section: 'Managers' } }
    });
  };

  const handleDelete = (e, managerId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this manager?")) {
      axios.delete(`http://localhost:8080/profile/user/${managerId}`)
        .then(() => {
          setAllManagers(prev => prev.filter(mng => mng.id !== managerId));
        })
        .catch(error => {
          console.error("Delete failed:", error);
          alert("Failed to delete manager");
        });
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Manager Section</h2>

      <input
        type="text"
        placeholder="Search for managers"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full md:w-2/3 lg:w-1/2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 overflow-y-auto flex-1 pr-2 max-h-[70vh]">
        {filteredManagers.length > 0 ? (
          filteredManagers.map((manager) => (
            <div
              key={manager.id}
              className="relative border border-gray-200 p-4 mb-4 cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleClick(manager.id)}
            >
              <h4 className="text-lg font-semibold mb-2">{manager.username}</h4>
              <p className="text-gray-600">Email: {manager.profile?.email}</p>
              <p className="text-gray-600">Phone: {manager.profile?.phone}</p>

              <button
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                onClick={(e) => handleDelete(e, manager.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No managers found.</p>
        )}
      </div>
    </div>
  );
}

export default ManagerSection;