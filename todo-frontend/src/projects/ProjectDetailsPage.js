import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather'; // <-- 1. IMPORT THE ICON
import { useAuth } from '../context/AuthContext';

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); 
  const [project, setProject] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    // Make sure this URL is correct based on your backend controller
    axios.get(`http://localhost:8080/projects/${projectId}`)
      .then(response => {
        setProject(response.data);
        setAssignedUsers(response.data.assignedUsers || []);
      })
      .catch(error => console.error("Error fetching project details:", error))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  const filteredUsers = assignedUsers.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    const path = isAdmin
      ? `/admin/projects/${projectId}/assign/${userId}`
      : `/manager/projects/${projectId}/assign/${userId}`;
    navigate(path);
  };

  const handleBackClick = () => {
    const path = isAdmin ? '/admin/projects' : '/manager/projects';
    navigate(path);
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
    </div>
  );

  if (isLoading) {
    return <div className="p-6 bg-gray-100 min-h-screen"><LoadingSpinner /></div>;
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-100">
      
      {/* --- 2. ADD THE BACK BUTTON AND HEADER SECTION --- */}
      <div className="mb-4">
        <button 
          onClick={handleBackClick} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to All Projects
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          Team Members for: <span className="text-indigo-600">{project?.name}</span>
        </h2>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for team members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 w-full md:w-2/3 lg:w-1/2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* List Container */}
      <div className="mt-4 overflow-y-auto flex-1 pr-2 max-h-[70vh]">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="relative border border-gray-200 p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:border-indigo-400 transition-all duration-300 cursor-pointer"
            >
              <h4 className="text-lg font-semibold mb-2 text-gray-800">{user.username}</h4>
              <p className="text-gray-600">Role: {user.role}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">
            {searchTerm 
              ? `No members found matching "${searchTerm}".` 
              : "No members found for this project."
            }
          </p>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailsPage