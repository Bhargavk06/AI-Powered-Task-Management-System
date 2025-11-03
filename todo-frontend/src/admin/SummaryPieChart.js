import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SummaryPieChart = ({ title, data, colors, isLoading }) => {
  return (
    // Use the standard card styling for consistency
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      
      <div className="w-full h-64"> {/* Fixed height container for the chart/skeleton */}
        {isLoading ? (
          // Professional skeleton loader
          <div className="flex justify-center items-center h-full">
            <div className="w-48 h-48 rounded-full bg-slate-200 animate-pulse"></div>
          </div>
        ) : (
          // The actual chart
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SummaryPieChart;