import {React,useState,useEffect} from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function TaskSummarySection() {
  // States:
  const [totalSummary, setTotalSummary] = useState([]);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [managerSummary, setManagerSummary] = useState([]);
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']; // To Do, In Progress, Done
  const pieData = [
  { name: 'To Do', value: totalSummary[1] },
  { name: 'In Progress', value: totalSummary[2] },
  { name: 'Done', value: totalSummary[3] }
];

const pieDataEmployee = [
  { name: 'To Do', value: employeeSummary[1] },
  { name: 'In Progress', value: employeeSummary[2] },
  { name: 'Done', value: employeeSummary[3] }
];

const pieDataManager = [
  { name: 'To Do', value: managerSummary[1] },
  { name: 'In Progress', value: managerSummary[2] },
  { name: 'Done', value: managerSummary[3] }
];


  useEffect(()=>{
    axios.get(`http://localhost:8080/assigntask/totalSummary`)
    .then((response)=>{
        console.log("Total summary response:", response.data);
        setTotalSummary(response.data);
    })
    .catch((error)=>{
        console.log("Error fetching total summary of tasks", error);
    })

    axios.get(`http://localhost:8080/assigntask/totalEmployeeSummary`)
    .then((response)=>{
      console.log("Total Employee summary response:", response.data);
      setEmployeeSummary(response.data);
    })
    .catch((error)=>{
      console.log("Total Employee Response:",error);
    })

    axios.get(`http://localhost:8080/assigntask/totalManagerSummary`)
    .then((response)=>{
      console.log("Total Manager summary response:", response.data);
      setManagerSummary(response.data);
    })
    .catch((error)=>{
      console.log("Total Manager Summary",error);
    })

  },[]);

  return (
  <>
    <h2>Overall Task Distribution</h2>
    {totalSummary.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p>Loading task summary...</p>
    )}

    <h2>Employee Task Summary</h2>
    {employeeSummary.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieDataEmployee}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieDataEmployee.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p>Loading task summary...</p>
    )}


    <h2>Manager Task Summary</h2>
    {managerSummary.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieDataManager}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieDataManager.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <p>Loading task summary...</p>
    )}
    
  </>
);

}
export default TaskSummarySection;