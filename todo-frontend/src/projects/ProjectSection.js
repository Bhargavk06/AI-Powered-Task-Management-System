// src/ProjectSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Archive } from 'react-feather';
import ProjectCard from '../projects/ProjectCard'; 

function ProjectSection() {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = () => {
    setIsLoading(true);
    axios.get('http://localhost:8080/projects')
      .then(response => setAllProjects(response.data))
      .catch(error => console.error("Error fetching projects:", error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (projectId) => {
    navigate(`/admin/projects/edit/${projectId}`);
  };

  const handleDelete = (projectId) => {
    // User confirmation is a good UX practice
    if (window.confirm('Are you sure you want to delete this project?')) {
      axios.delete(`http://localhost:8080/projects/${projectId}`)
        .then(() => {
          // For instant UI feedback, filter out the deleted project from state
          setAllProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
        })
        .catch(error => {
          console.error("Error deleting project:", error);
          alert('Failed to delete project.');
        });
    }
  };

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ... (LoadingSpinner component remains the same)
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* ... (Header and Search Filter are the same) ... */}
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => navigate('/admin/projects/new')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Search Filter Input */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full max-w-md pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={handleEdit}     // <-- PASS HANDLERS
              onDelete={handleDelete} // <-- AS PROPS
            />
          ))}
        </div>
      ) : (
        // ... (Empty state message is the same)
         <div className="text-center py-16">
            <Archive className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Projects Found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search.' : 'Get started by creating a new project.'}
            </p>
        </div>
      )}
    </div>
  );
}

export default ProjectSection;