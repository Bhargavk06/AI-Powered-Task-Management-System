import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TaskComments from '../TaskComments';
import AdminDashboard from './AdminDashboard';
function AssignTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMap, setUnreadMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState(''); 
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedTask, setSelectedTask] = useState(null); //  Track selected task for viewing comments
  const userId = localStorage.getItem('userId');

  useEffect(() => {
  axios
    .get(`http://localhost:8080/assigntask/gettask/${id}`)
    .then((response) => setTasks(response.data))
    .catch((error) => console.error("Fetching Error: ", error));
  axios
    .get(`http://localhost:8080/comments/unread-map/${userId}`)
    .then((res) => setUnreadMap(res.data))
    .catch((err) => console.log("Error loading unread map", err));
}, [id, tasks]); // Add tasks to dependency array

const handleAssign = async (e) => {
  e.preventDefault();
  const newTask = { taskname: taskName, description, status, deadline };

  try {
    await axios.post(`http://localhost:8080/assigntask/assign/${id}?assignerId=${userId}`, newTask);
    const response = await axios.get(`http://localhost:8080/assigntask/gettask/${id}`);
    setTasks(response.data); // Update tasks state with fresh data
    resetForm();
  } catch (error) {
    console.error("Error assigning task:", error);
  }
};

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedTask = { taskId: editTaskId, taskname: taskName, description, status, deadline };

    axios.put(`http://localhost:8080/assigntask/updateTask`, updatedTask)
      .then(() => axios.get(`http://localhost:8080/assigntask/gettask/${id}`))
      .then((response) => {
        console.log("Fetched after assignment1:", response.data);
        setTasks(response.data);
        resetForm();
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleBack = () => {
    const fromState = location.state?.from;
    if (fromState?.path === '/admintodo' && fromState?.section) {
      navigate('/admintodo', { state: { section: fromState.section }, replace: true });
      return;
    }
    if (fromState && typeof fromState === 'string') {
      navigate(fromState, { replace: true });
      return;
    }
    navigate('/employeesection', { replace: true });
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete(`http://localhost:8080/assigntask/deleteTask/${taskId}`)
        .then(() => setTasks(tasks.filter(task => task.taskId !== taskId)))
        .catch((error) => console.error("Error deleting the task:", error));
    }
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.taskId === taskId);
    if (taskToEdit) {
      setTaskName(taskToEdit.taskname);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setDeadline(taskToEdit.deadline);
      setIsEditing(true);
      setEditTaskId(taskId);
      setShowForm(true);
    }
  };

  const resetForm = () => {
    setTaskName('');
    setDescription('');
    setStatus('To Do');
    setDeadline('');
    setIsEditing(false);
    setEditTaskId(null);
    setShowForm(false);
  };

  const toggleDetails = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

   const openCommentsModal = async (t) => {
    try {
      await axios.get(`http://localhost:8080/comments/view/${t.taskId}/${userId}`);
      setUnreadMap((prev) => ({ ...prev, [t.taskId]: false }));
      setSelectedTask(t);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };


  const getDeadlineColor = (deadline) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return '#ff4d4f';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return '#ffa940';
    } else if (taskDate > tomorrow) {
      return '#52c41a';
    } else {
      return '#d9d9d9';
    }
  };


  // 🔍 Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesName = task.taskname.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesStartDate = startDate ? new Date(task.deadline) >= new Date(startDate) : true;
    const matchesEndDate = endDate ? new Date(task.deadline) <= new Date(endDate) : true;

    return matchesName && matchesStatus && matchesStartDate && matchesEndDate;
  });

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Employee   #{id} Task List</h2>
      <button onClick={handleBack} style={styles.backBtn}>← Back</button>

      <button onClick={() => setShowForm(!showForm)} style={styles.addTaskBtn}>
        {showForm ? 'Close Form' : (isEditing ? 'Edit Task' : 'Add Task')}
      </button>

      {showForm && (
        <form
          onSubmit={isEditing ? handleUpdate : handleAssign}
          style={styles.form}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Task Name:</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option>To Do</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            {isEditing ? 'Save Changes' : 'Assign Task'}
          </button>

          {isEditing && (
            <button type="button" onClick={resetForm} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </form>

      )}

      {/* 🔍 Filters */}
      <div style={styles.filterContainer}>
  <div style={styles.filterItem}>
    <span style={styles.filterLabel}>🔍</span>
    <input
      type="text"
      placeholder="Search Task"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={styles.filterInput}
    />
  </div>

  <div style={styles.filterItem}>
    <span style={styles.filterLabel}>📋</span>
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      style={styles.filterSelect}
    >
      <option value="">All Statuses</option>
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>
  </div>

  <div style={styles.filterItem}>
    <span style={styles.filterLabel}>🗓️ From</span>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      style={styles.filterInput}
    />
  </div>

  <div style={styles.filterItem}>
    <span style={styles.filterLabel}>🗓️ To</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      style={styles.filterInput}
    />
  </div>
</div>




      {/* Task List */}
    
      <div style={{ marginTop: '30px', maxWidth: '600px', margin: 'auto' , padding:'40px'}}>
        {filteredTasks.map((task, index) => (
          <div key={index} style={{
            border: '1px solid #ccc',
            borderLeft: `8px solid ${getDeadlineColor(task.deadline)}`,
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h4> 📌 {task.taskname}</h4>
            <div>
              <span style={{ marginRight: '10px' }}>{task.status}</span>
              <button onClick={() => toggleDetails(task.taskId)}>{expandedTaskId === task.taskId ? '▲' : '▼'}</button>
              <button onClick={() => openCommentsModal(task)} style={styles.viewBtn}>
              View comments {unreadMap[task.taskId] && <span style={styles.redDot}></span>}
            </button>
              <button onClick={() => editTask(task.taskId)} style={styles.editBtn}>Edit</button>
              <button onClick={() => deleteTask(task.taskId)} style={styles.deleteBtn}>Delete</button>
            </div>

            {expandedTaskId === task.taskId && (
              <div style={{ marginTop: '10px' }}>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Deadline:</strong> {task.deadline}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>

  )
}
     
  const styles={
    
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalBox: {
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '10px',
      width: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.25)'
    },
    selectMenu: {
      backgroundColor: '#1890ff',
      color: 'white',
      padding: '8px 12px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      width: '150px',
      marginTop: '10px'
    },
    redDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      backgroundColor: 'red',
      borderRadius: '50%',
      marginLeft: '6px',
      verticalAlign: 'middle'
    },
    viewBtn: {
      padding: '8px 16px',
      marginRight: '10px', 
      marginLeft: '10px',
      backgroundColor: '#13c2c2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    deleteBtn: {
      padding: '8px 16px',
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    editBtn: {
      padding: '8px 16px',
      marginRight: '10px',
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    backBtn:{
      padding: '8px 16px',
      marginRight: '10px',
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    addTaskBtn:{
      padding: '8px 16px',
      margin:'20px',
      marginRight: '10px',
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background 0.2s',
    },
    redDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      backgroundColor: 'red',
      borderRadius: '50%',
      marginLeft: '6px',
      verticalAlign: 'middle'
    },
    form: {
    display: 'inline-block',
    textAlign: 'left',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    marginBottom: '30px',
    backgroundColor: '#f9f9f9',
    width: '350px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    marginLeft: '10px',
  },
  filterContainer: {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  padding: '20px',
  marginBottom: '30px',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
},

filterItem: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minWidth: '160px',
},

filterLabel: {
  fontSize: '13px',
  marginBottom: '6px',
  fontWeight: '500',
  color: '#333',
},

filterInput: {
  padding: '10px 12px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '14px',
  backgroundColor: '#fff',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
},

filterSelect: {
  padding: '10px 12px',
  width: '100%',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '14px',
  backgroundColor: '#fff',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
}

  }

export default AssignTask;


/*
useState: Manages component-level state for form fields, task list, filtering, editing, and modal display.

useEffect: Executes side-effect to fetch tasks from backend when component mounts or id changes.

useParams: Retrieves id from the route URL. Used to fetch tasks for a specific employee.

useNavigate: Programmatic navigation (here used for "back" button).

axios: Used for HTTP requests (GET, POST, PUT, DELETE) to Spring Boot backend.

Form Handling: Form is shown conditionally using showForm, handles both task creation and update depending on isEditing.

Editing Logic: editTask() loads selected task into form, handleUpdate() updates it via PUT request.

Filtering Logic: Allows searching by name, filtering by status, and deadline range using controlled inputs and .filter() on tasks.

Conditional Rendering: Uses && to display task details, form, or modal only when conditions are met.

Modal Display: Shows TaskComments inside a styled overlay box for selected task.

Component Reusability: Modular structure like TaskComments improves maintainability and separation of concerns.

LocalStorage: Used to retrieve userId for identifying the logged-in user.

*/
