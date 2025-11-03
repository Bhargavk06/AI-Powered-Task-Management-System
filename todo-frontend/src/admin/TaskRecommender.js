import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cpu } from 'react-feather'; // Using an icon for the button

function TaskRecommender() {
  const [description, setDescription] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // --- NEW: State to hold a map of user IDs to usernames ---
  const [userMap, setUserMap] = useState({});

  // --- NEW: useEffect to fetch all users on component mount ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch both employees and managers concurrently
        const [employeesRes, managersRes] = await Promise.all([
          axios.get('http://localhost:8080/profile/employees'),
          axios.get('http://localhost:8080/profile/managers')
        ]);

        const allUsers = [...employeesRes.data, ...managersRes.data];
        
        // Create a simple object for fast lookup: { 'userId': 'username' }
        const idToNameMap = allUsers.reduce((acc, user) => {
          acc[user.id] = user.username;
          return acc;
        }, {});

        setUserMap(idToNameMap);
      } catch (err) {
        console.error("Failed to fetch user list for mapping:", err);
      }
    };
    fetchUsers();
  }, []); // Runs only once

  const findBestFit = () => {
    if (!description.trim()) {
      setError('Please enter a task description.');
      return;
    }

    setIsLoading(true);
    setError('');
    setRecommendations([]);

    axios
      .post(`http://localhost:8080/api/recommend`, description, {
        headers: { 'Content-Type': 'text/plain' }
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          setRecommendations(response.data);
        }
      })
      .catch(error => {
        setError("Could not get recommendations. Please try again later.");
        console.error("Fetching error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    // Main page container with consistent padding and background
    <div className="w-full p-6 md:p-8">
      <div className="flex flex-col space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Task Recommender Buddy</h1>
          <p className="text-slate-500 mt-1">Get intelligent employee suggestions based on your task description.</p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="task-description" className="block text-sm font-semibold text-slate-700 mb-2">
            Task Description
          </label>
          <textarea
            id="task-description"
            placeholder="e.g., Develop a new Spring Boot microservice for handling user authentication..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="4"
            className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={findBestFit}
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              <Cpu size={18} className="mr-2" />
              {isLoading ? 'Analyzing...' : 'Get Suggestions'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-center font-medium">{error}</p>}
        
        {/* Results Section */}
        {!isLoading && recommendations.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Top Suggestions</h3>
            <div className="flex flex-col space-y-4">
              {recommendations.map((item, index) => {
                const username = userMap[item.employeeId] || `ID: ${item.employeeId}`;
                const scorePercentage = Math.min((item.score / 2.5) * 100, 100); // Normalize score for progress bar

                return (
                  <div key={index} className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold">
                      {username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-slate-800">{username}</p>
                        <span className="text-sm font-semibold text-emerald-600">{item.score.toFixed(2)} Score</span>
                      </div>
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${scorePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TaskRecommender;