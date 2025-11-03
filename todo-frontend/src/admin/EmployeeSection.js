import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useConfirmationModal from '../components/useConfirmationModal';
import { Search, Trash2 } from 'react-feather'; // Import the same icons

function EmployeeSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allEmployees, setAllEmployees] = useState([]);
  const navigate = useNavigate();

  // No changes needed for the data fetching and business logic.
  // It's already well-structured.
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
    navigate(`../assignTask/${employeeId}`);
  };

  const deleteEmployeeAction  = (employeeId) => {
      return axios.delete(`http://localhost:8080/profile/user/${employeeId}`)
        .then(() => {
          setAllEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        })
        .catch(error => {
          console.error("Delete failed:", error);
          alert("Failed to delete employee");
          throw error;
        });
  };

   const [askForDeleteConfirmation, DeleteConfirmationModal] = useConfirmationModal({
    onConfirm: deleteEmployeeAction,
    title: "Delete Employee",
    message: "Are you sure you want to delete this employee? This action cannot be undone.",
    confirmText: "Delete",
  });

  // All UI improvements are in the JSX below.
  return (
    // The main wrapper is correct, inheriting the background from the layout.
    <div className="w-full p-6 md:p-8">
      <div className="flex flex-col space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Employee Section</h1>
          <p className="text-slate-500">Search for and manage company employees.</p>
        </div>
        
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // --- CHANGE #1: Updated focus ring color for theme consistency ---
            className="w-full md:w-1/2 lg:w-1/3 pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex flex-col space-y-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                // --- CHANGE #2: Added the premium border-on-hover effect ---
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg flex items-center justify-between cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all duration-300"
                onClick={() => handleClick(employee.id)}
              >
                {/* User Info */}
                <div className="flex flex-col space-y-1">
                  <h3 className="text-lg font-semibold text-slate-800">{employee.username}</h3>
                  <p className="text-sm text-slate-500">{employee.profile?.email}</p>
                  <p className="text-sm text-slate-500">{employee.profile?.phone}</p>
                </div>

                {/* Subtle Delete Button */}
                <button
                  className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    askForDeleteConfirmation(employee.id);
                  }}
                >
                  <span className="sr-only">Delete {employee.username}</span>
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 mt-4 text-center">No employees found.</p>
          )}
        </div>
      </div>
      <DeleteConfirmationModal />
    </div>
  );
}

export default EmployeeSection;

