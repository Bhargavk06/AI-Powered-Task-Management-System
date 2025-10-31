import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../components/AppIcon';

// The triggerRefresh prop is a simple counter. When it changes, the useEffect hook will re-run.
const FileList = ({ taskId, triggerRefresh }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:8080/api/tasks/${taskId}/files`)
      .then(response => {
        setFiles(response.data);
      })
      .catch(error => {
        console.error("Error fetching files:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [taskId, triggerRefresh]); // <-- Add triggerRefresh to the dependency array

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading files...</p>;
  }

  if (files.length === 0) {
    return <p className="text-sm text-gray-500">No attachments.</p>;
  }

  return (
    <div className="space-y-2">
      {files.map(file => (
        <a 
          key={file.id}
          href={`http://localhost:8080/api/files/${file.id}`} 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-blue-600 hover:underline hover:text-blue-800 transition-colors"
        >
          <Icon name="Paperclip" size={14} />
          <span>{file.filename}</span>
        </a>
      ))}
    </div>
  );
};

export default FileList;