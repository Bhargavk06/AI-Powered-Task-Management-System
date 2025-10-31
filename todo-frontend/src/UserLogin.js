
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function UserAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [userId,setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setRole('');
    setPhone('');
    setEmail('');
    setUserId('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:8080/user/login', {
          id: userId,
          password,
          role
        });

        const authenticatedUser = response.data;

        if (authenticatedUser && authenticatedUser.id) {
           // --- THIS IS THE FIX ---
           // Create the userData object using the VERIFIED data from the backend response.
           const userData = { 
               userId: authenticatedUser.id, 
               username: authenticatedUser.username, 
               role: authenticatedUser.role 
           };
           
           // The login function will now save the correct ID to local storage.
           login(userData);
           
           // Navigation logic is the same
           if (authenticatedUser.role === 'admin') navigate('/admin');
           else if (authenticatedUser.role === 'manager') navigate('/manager');
           else navigate('/emptodo');
         } else {
            // Handle cases where login might fail but not throw an error
            setMessage('Login failed. Invalid credentials.');
         }
      } catch (error) {
        console.error('Login error:', error);
        setMessage('Login failed. Please try again.');
      }
    }  else {
      try {
        const response = await axios.post('http://localhost:8080/user/register', {
          id: userId,
          username,
          password,
          role,
          profile: {
            email,
            phone,
    
          },
        });
        setMessage(response.data);
      } catch (error) {
        console.error('Registration error:', error);
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <input
          type="text"
          placeholder="UserID"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
           
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>

        <button type="submit" style={styles.button}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button onClick={handleToggle} style={styles.toggleBtn}>
        {isLogin ? 'Create Account' : 'Back to Login'}
      </button>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    marginTop: '100px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  toggleBtn: {
    marginTop: '10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    fontWeight: 'bold',
  },
};

export default UserAuthPage;
