import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryPieChart from './SummaryPieChart'; // Adjust the import path as needed

// Define theme-consistent colors for the charts
const STATUS_COLORS = [
  '#38bdf8', // Sky (To Do)
  '#f59e0b', // Amber (In Progress)
  '#10b981', // Emerald (Done)
];

// A helper function to process the raw data from the backend
const processSummaryData = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length < 4) {
    return [
      { name: 'To Do', value: 0 },
      { name: 'In Progress', value: 0 },
      { name: 'Done', value: 0 },
    ];
  }
  return [
    { name: 'To Do', value: rawData[1] },
    { name: 'In Progress', value: rawData[2] },
    { name: 'Done', value: rawData[3] },
  ];
};


function TaskSummarySection() {
  const [summaryData, setSummaryData] = useState({
    total: [],
    employee: [],
    manager: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication Error: Please log in again.");
        setIsLoading(false);
        return Promise.reject("No token found");
      }
      const headers = { 'Authorization': `Bearer ${token}` };

      setIsLoading(true);
      try {
        // Fetch all endpoints concurrently for better performance
        const [totalRes, employeeRes, managerRes] = await Promise.all([
          axios.get('http://localhost:8080/assigntask/totalSummary', {headers}),
          axios.get('http://localhost:8080/assigntask/totalEmployeeSummary', {headers}),
          axios.get('http://localhost:8080/assigntask/totalManagerSummary', {headers}),
        ]);

        // Process and set all data at once
        setSummaryData({
          total: processSummaryData(totalRes.data),
          employee: processSummaryData(employeeRes.data),
          manager: processSummaryData(managerRes.data),
        });

      } catch (error) {
        console.error("Error fetching task summaries:", error);
        // In a real app, you might set an error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  return (
    // Main container with consistent padding and background
    <div className="w-full p-6 md:p-8">
      <div className="flex flex-col space-y-6">

        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Task Summary</h1>
          <p className="text-slate-500 mt-1">An overview of task distribution across the organization.</p>
        </div>

        {/* Grid container for the summary charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SummaryPieChart
            title="Overall Task Distribution"
            data={summaryData.total}
            colors={STATUS_COLORS}
            isLoading={isLoading}
          />
          <SummaryPieChart
            title="Employee Task Summary"
            data={summaryData.employee}
            colors={STATUS_COLORS}
            isLoading={isLoading}
          />
          <SummaryPieChart
            title="Manager Task Summary"
            data={summaryData.manager}
            colors={STATUS_COLORS}
            isLoading={isLoading}
          />
        </div>
        
      </div>
    </div>
  );
}

export default TaskSummarySection;