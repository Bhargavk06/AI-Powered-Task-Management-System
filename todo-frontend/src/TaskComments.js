import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskComments({ taskId, userId }) {
  const [comments, setComments] = useState([]);
  const [sendComment, setSendComment] = useState('');

  useEffect(() => {
    if (taskId && userId) {
      fetchComments();
    }
  }, [taskId, userId]);

  const fetchComments = () => {
    axios.get(`http://localhost:8080/comments/view/${taskId}/${userId}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log("Fetching comments error:", error);
      });
  };

  const handleComment = () => {
    const newComment = {
      taskId,
      userId,
      content: sendComment,
      timestamp: new Date().toISOString()
    };

    axios.post(`http://localhost:8080/comments/add`, newComment)
      .then(() => {
        setSendComment("");
        fetchComments();
      })
      .catch((error) => {
        console.log("Error sending comment:", error);
      });
  };

  const formatTimestamp = (timestamp) => {
    const utcTimestamp = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
    const date = new Date(utcTimestamp);
    return date.toLocaleString(undefined, {
      hour12: true,
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: '#fff'
    }}>
      <h4 style={{ marginBottom: '10px' }}>Comments</h4>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '10px',
        marginBottom: '10px'
      }}>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c, index) => {
            const isOwn = c.userId === userId;
            return (
              <div key={index} style={{
                marginBottom: '15px',
                textAlign: isOwn ? 'right' : 'left',
                padding: '8px',
                backgroundColor: isOwn ? '#e6f7ff' : '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {c.userId} • {formatTimestamp(c.timestamp)}
                </div>
                <div style={{ fontSize: '15px', marginTop: '5px' }}>{c.content}</div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={sendComment}
          onChange={(e) => setSendComment(e.target.value)}
          placeholder="Type your comment"
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleComment}
          style={{
            marginLeft: '10px',
            padding: '8px 14px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default TaskComments;
