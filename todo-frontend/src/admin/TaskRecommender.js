import { useState } from 'react';
import axios from 'axios';

function TaskRecommender() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const findBestFit = () => {
    axios
      .post(`http://localhost:8080/api/recommend`, {
        task_description: searchTerm
      })
      .then(response => {
        console.log(response.data);
        // Save recommendations in state
        setRecommendations(response.data.recommendations);
      })
      .catch(error => {
        console.error("Fetching error:", error);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Task Description"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          width: '60%',
          fontSize: '16px',
          marginTop: '10px'
        }}
      />

      <button
        onClick={findBestFit}
        style={{
          marginLeft: '10px',
          padding: '10px',
          fontSize: '16px'
        }}
      >
        Recommend
      </button>

      {recommendations.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Top Recommendations:</h3>
          <ul>
            {recommendations.map((item, index) => (
              <li key={index}>
                <strong>Employee ID:</strong> {item.employee_id} <br />
                <strong>Score:</strong> {item.score.toFixed(4)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskRecommender;
