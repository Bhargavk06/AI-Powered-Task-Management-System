import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TaskComments from './TaskComments';
import { useNavigate } from 'react-router-dom';

function EmployeeTodo() {
  const [task, setTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/assigntask/gettask/${userId}`)
        .then((response) => setTask(response.data))
        .catch((error) => console.log(error));

      axios.get(`http://localhost:8080/comments/unread-map/${userId}`)
        .then((res) => setUnreadMap(res.data))
        .catch((err) => console.log("Error loading unread map", err));
    }
  }, [userId]);

    const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put('http://localhost:8080/assigntask/updateStatus', {
        taskId: taskId,
        status: newStatus
      });
      setTask(prev =>
        prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t)
      );
      alert("Status updated!");
    } catch (error) {
      console.error("Failed to update status", error);
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

  const openCommentsModal = async (t) => {
    try {
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

  const pageStyle = {
    backgroundColor: isDark ? '#121212' : '#f0f2f5',
    color: isDark ? '#f5f5f5' : '#333',
    minHeight: '100vh',
    padding: '20px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <h2 style={{ textAlign: 'center' }}>Welcome, {userId}</h2>
      <h3 style={{ textAlign: 'center' }}>Assigned Tasks:</h3>

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          ...styles.logoutBtn,
          right: '160px',
          backgroundColor: isDark ? '#ffc107' : '#333'
        }}
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      {Array.isArray(task) && task.length > 0 ? (
        task.map((t, index) => (
          <div key={index} style={{
            border: '1px solid #ccc',
            borderLeft: `8px solid ${getDeadlineColor(t.deadline)}`,
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            color: isDark ? '#f5f5f5' : '#333'
          }}>
            <h4>📌 {t.taskname}</h4>
            <p>Status: <strong>{t.status}</strong></p>
            <p>Description: {t.description}</p>
            <p>
              🕒 Deadline: <span style={{ fontWeight: 'bold', color: getDeadlineColor(t.deadline) }}>{t.deadline}</span>
            </p>
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(t.taskId, e.target.value)}
              style={styles.selectMenu}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button onClick={() => openCommentsModal(t)} style={styles.viewBtn}>
              View comments {unreadMap[t.taskId] && <span style={styles.redDot}></span>}
            </button>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center' }}>No tasks found.</p>
      )}

      {selectedTask && (
        <div style={styles.modalOverlay}>
          <div style={{
            ...styles.modalBox,
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            color: isDark ? '#f5f5f5' : '#333'
          }}>
            <h3>💬 Comments for Task: {selectedTask.taskname}</h3>
            <TaskComments taskId={selectedTask.taskId} userId={userId} />
            <button onClick={() => setSelectedTask(null)} style={styles.closeBtn}>Close</button>
          </div>
        </div>
      )}

      {/* Floating Chat Icon */}
      <button
        style={styles.chatIcon}
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div style={{
          ...styles.chatWindow,
          backgroundColor: isDark ? '#1e1e1e' : '#fff',
          color: isDark ? '#f5f5f5' : '#333'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>🤖 Ask Gemini</h4>
          <textarea
            placeholder="Type your prompt..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={styles.chatInput}
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
            style={styles.sendBtn}
          >
            {isLoading ? "..." : "Send"}
          </button>
          {chatResponse && (
            <div style={styles.chatResponse}>
              <strong>Gemini:</strong> {chatResponse}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
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
  viewBtn: {
    marginTop: '10px',
    marginLeft: '10px',
    padding: '6px 12px',
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  logoutBtn: {
    position: 'absolute',
    top: '40px',
    right: '40px',
    backgroundColor: '#1890ff',
    color: 'white',
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
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
    padding: '25px',
    borderRadius: '10px',
    width: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.25)'
  },
  closeBtn: {
    marginTop: '15px',
    padding: '6px 10px',
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  chatIcon: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#1890ff',
    color: 'white',
    fontSize: '24px',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 999
  },
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '30px',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 998
  },
  chatInput: {
    width: '100%',
    height: '60px',
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'none'
  },
  sendBtn: {
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  },
  chatResponse: {
    marginTop: '10px',
    backgroundColor: '#f6f6f6',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    maxHeight: '200px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap'
  }
};

export default EmployeeTodo;
