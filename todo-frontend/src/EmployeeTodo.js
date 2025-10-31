import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TaskComments from './TaskComments';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import Icon from './components/AppIcon';
import Button from './components/ui/Button';
import { useAuth } from './context/AuthContext';

// Helper functions (keep these)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const calculateDaysOverdue = (deadline) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(deadline);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate < today) {
    const diffTime = Math.abs(today.getTime() - taskDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
};

function EmployeeTodo() {
  const [task, setTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  //const userId = localStorage.getItem('userId');
  const {user} = useAuth();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false); 

  // State for filters and search (assuming these are defined elsewhere or will be added)
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'kanban', 'calendar'
  const [sortOrder, setSortOrder] = useState('status');

  // State for Calendar 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());


  useEffect(() => {
    if(!user){
      return;
    }
    const userId = user.userId;
    if (userId) {
      axios.get(`http://localhost:8080/assigntask/gettask/${userId}`)
        .then((response) => setTask(response.data))
        .catch((error) => console.log(error));

      axios.get(`http://localhost:8080/comments/unread-map/${userId}`)
        .then((res) => setUnreadMap(res.data))
        .catch((err) => console.log("Error loading unread map", err));
    }
  }, [user]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put('http://localhost:8080/assigntask/updateStatus', {
        taskId: taskId,
        status: newStatus
      });
      setTask(prev =>
        prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t)
      );
      // alert("Status updated!"); 
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const openCommentsModal = async (t) => {
    try {
      const userId = user.userId;
      await axios.get(`http://localhost:8080/comments/view/${t.taskId}/${userId}`);
      setUnreadMap((prev) => ({ ...prev, [t.taskId]: false }));
      setSelectedTask(t);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleLogout = () => {
    navigate('/UserLogin');
  };

  // --- Filtering Logic ---
  const filteredTasks = task.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) {
      return false;
    }
    if (filterAssignee !== 'All' && t.assignedTo !== filterAssignee) {
      return false;
    }
    if (filterPriority !== 'All' && t.priority?.toLowerCase() !== filterPriority.toLowerCase()) {
            return false;
    }
    if (searchTerm &&
        !(t.taskname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.priority?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.status?.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const sortedAndFilteredTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOrder) {
      case 'deadline-asc':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'deadline-desc':
        return new Date(b.deadline) - new Date(a.deadline);
      case 'priority':
        // Custom sort for priority: High > Medium > Low
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority?.toLowerCase()] || 4) - (priorityOrder[b.priority?.toLowerCase()] || 4);
      case 'status':
      default:
        // Default sort by status: To Do > In Progress > Done
        const statusOrder = { "To Do": 1, "In Progress": 2, "Done": 3 };
        return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    }
  });



  // Calculate task counts
  const totalTasks = task.length;
  const inProgressTasks = task.filter(t => t.status === 'In Progress').length;
  const completedTasks = task.filter(t => t.status === 'Done').length;
  const overdueTasks = task.filter(t => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(t.deadline);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today && t.status !== 'Done';
  }).length;

  const uniqueAssignees = [...new Set(task.map(t => t.assignedTo))].filter(Boolean);

  // Group tasks for Kanban view
  const tasksByStatus = filteredTasks.reduce((acc, t) => {
    const status = t.status || 'No Status';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(t);
    return acc;
  }, {});

  const statusColumns = ['To Do', 'In Progress', 'Done'];

  const getPriorityColorKanban = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#ffa940';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // --- Calendar Logic ---
  const getPriorityDotColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const tasksByDate = filteredTasks.reduce((acc, t) => {
    const date = new Date(t.deadline).toLocaleDateString('en-CA');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(t);
    return acc;
  }, {});

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
      if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
      if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const actualFirstDayOffset = firstDay;

    const blanks = Array.from({ length: actualFirstDayOffset }, (_, i) => (
      <div key={`blank-${i}`} className="min-h-[100px]"></div> // Tailwind for min-height
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = dateObj.toLocaleDateString('en-CA');
      const dayTasks = tasksByDate[dateStr] || [];
      const isToday = new Date().toLocaleDateString('en-CA') === dateStr;

      return (
        <div
          key={`day-${day}`}
          className="min-h-[100px] p-2 text-sm relative border border-gray-200 dark:border-gray-700 flex flex-col items-start overflow-hidden bg-white dark:bg-gray-800"
        >
          <span className={`font-bold relative z-10 ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center float-right text-xs' : 'text-gray-700 dark:text-gray-50'}`}>
            {day}
          </span>
          <div className="mt-1 w-full max-h-[calc(100%-30px)] overflow-y-auto">
            {dayTasks.map(t => (
              <div
                key={t.taskId}
                className="flex items-center rounded-sm px-1 py-1 mb-1 cursor-pointer text-xs whitespace-nowrap overflow-hidden text-ellipsis w-[calc(100%-2px)]"
                style={{
                  backgroundColor: getPriorityDotColor(t.priority) === 'red' ? '#ffe8e6' : getPriorityDotColor(t.priority) === 'orange' ? '#fff1e6' : '#e6ffe6',
                  color: getPriorityDotColor(t.priority) === 'red' ? '#cf1322' : getPriorityDotColor(t.priority) === 'orange' ? '#d46b08' : '#237804',
                }}
                onClick={() => setSelectedTask(t)}
              >
                <span
                  className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                  style={{ backgroundColor: getPriorityDotColor(t.priority) }}
                  title={t.priority}
                ></span>
                {t.taskname}
              </div>
            ))}
          </div>
        </div>
      );
    });

    return [...blanks, ...days];
  };

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-50 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-gray-50">Task Management</h1>
      <p className="text-lg text-center mb-8 text-gray-600 dark:text-gray-300">Manage and track tasks across your organization with intelligent workflow orchestration</p>

      <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
        {/* View Toggle Buttons */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
          <button
            className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 border-r border-gray-300 dark:border-gray-700
                      ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setViewMode('list')}
          >
             <Icon name="List" size={16} className="inline-block mr-1" /> List View
          </button>
          <button
            className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 border-r border-gray-300 dark:border-gray-700
                      ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setViewMode('kanban')}
          >
             <Icon name="LayoutDashboard" size={16} className="inline-block mr-1" /> Kanban Board
          </button>
          <button
            className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200
                      ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setViewMode('calendar')}
          >
            <Icon name="Calendar" size={16} className="inline-block mr-1" /> Calendar View
          </button>
        </div>

        {/* Task Statistics and Search */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Total: {totalTasks}</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> In Progress: {inProgressTasks}</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Completed: {completedTasks}</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Overdue: {overdueTasks}</span>
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 text-sm w-48 transition-all duration-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            onClick={() => setIsDark(!isDark)}
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon name={isDark ? "Sun" : "Moon"} size={20} />
          </Button>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="ml-2">
            <Icon name="LogOut" size={16} className="mr-1" /> Logout
          </Button>
        </div>
      </div>


      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-right-0" // Add bg-right-0 if needed for custom arrow
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priorityFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
          <select
            id="priorityFilter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-right-0"
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="assigneeFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">Assignee:</label>
          <select
            id="assigneeFilter"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-right-0"
          >
            <option value="All">All</option>
            {uniqueAssignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>
        {/*SORT BY*/}
        <div className="flex items-center gap-2">
            <label htmlFor="statusSort" className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
            <select
                id="statusSort"
                value={sortOrder} // Bind to the new state
                onChange={(e) => setSortOrder(e.target.value)} // Update the state on change
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 ... "
            >
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="deadline-asc">Due Date (Asc)</option>
                <option value="deadline-desc">Due Date (Desc)</option>
            </select>
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'list' && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.isArray(filteredTasks) && sortedAndFilteredTasks.length > 0 ? (
        sortedAndFilteredTasks.map((t) => (
            <TaskCard
              key={t.taskId}
              task={t}
              onStatusChange={handleStatusChange}
              showStatusChanger={true}
              openCommentsModal={openCommentsModal}
              unreadComments={unreadMap[t.taskId]}
            />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">No tasks found matching your filters.</p>
      )}
    </div>
  )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {statusColumns.map(status => (
            <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[300px] flex flex-col shadow-sm">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-50 text-center">
                {status} ({tasksByStatus[status]?.length || 0})
              </h4>
              <div className="flex-grow flex flex-col gap-3 min-h-[50px]">
                {tasksByStatus[status] && tasksByStatus[status].length > 0 ? (
                  tasksByStatus[status].map(t => (
                    <TaskCard
                      key={t.taskId}
                      task={t}
                      onStatusChange={handleStatusChange}
                      showStatusChanger={true}
                      openCommentsModal={openCommentsModal}
                      unreadComments={unreadMap[t.taskId]}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-5">No tasks in this column.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-5">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg transition-colors duration-200"
              onClick={() => handleMonthChange('prev')}
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-50">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg transition-colors duration-200"
              onClick={() => handleMonthChange('next')}
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            {weekDays.map(day => (
              <div key={day} className="bg-gray-100 dark:bg-gray-700 p-2 text-center font-bold text-sm text-gray-600 dark:text-gray-300">
                {day.substring(0, 3)}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {/* Floating Chat Icon */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition-colors duration-200 z-50"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div
          className={`fixed bottom-24 right-6 w-80 h-[400px] p-4 rounded-lg shadow-xl flex flex-col z-50
                      ${isDark ? 'bg-gray-900 text-gray-50' : 'bg-white text-gray-800'}`}
        >
          <h4 className="text-lg font-semibold mb-3">🤖 Ask Gemini</h4>
          <textarea
            placeholder="Type your prompt..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-grow w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-50"
          />
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const res = await axios.post('http://localhost:8080/api/gemini/ask', {
                  prompt: chatInput,
                });
                setChatResponse(res.data);
              } catch (err) {
                console.error('Chat failed', err);
                setChatResponse("❌ Something went wrong");
              } finally {
                setIsLoading(false);
              }
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
          {chatResponse && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md overflow-y-auto max-h-32 text-sm break-words">
              <strong className="block mb-1 text-blue-600 dark:text-blue-400">Gemini:</strong> {chatResponse}
            </div>
          )}
        </div>
      )}
      {selectedTask && (
        <TaskComments
          task={selectedTask}
          userId={user.userId}
          onClose={() => setSelectedTask(null)}
          onCommentAdded={() => {
            // Optionally refresh comments or update unread status
          }}
        />
      )}
    </div>
  );
}

export default EmployeeTodo;