import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import UserAuthPage from './UserLogin';
import EmployeeTodo from './EmployeeTodo';
import ManagerTodo from './manager/ManagerTodo';
import AdminTodo from './admin/AdminTodo';
import UserLogin from './UserLogin';
import WebSocketDemo from './WebSocketDemo';
import { NotificationProvider } from './NotificationProvider';
import ThemeProvider from './ThemeContext';
import AssignTaskPage from './admin/AssignTaskPage';
import EmployeeSectionPage from './admin/EmployeeSectionPage';
import ThemeToggle from './ThemeToggle'; 

function App() {
  const userId = localStorage.getItem('userId'); // ✅ Common user ID

  return (
    <ThemeProvider>
    <NotificationProvider userId={userId}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UserAuthPage />} />
            <Route path="/emptodo" element={<EmployeeTodo />} />
            <Route path="/managertodo" element={<ManagerTodo />} />
            <Route path="/admintodo" element={<AdminTodo />} />
            <Route path="/assignTask/:id" element={<AssignTaskPage />} />
            <Route path="/employeesection" element={<EmployeeSectionPage />} />
            <Route path="/UserLogin" element={<UserLogin />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
