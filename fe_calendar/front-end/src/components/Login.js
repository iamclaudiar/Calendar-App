import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Style.css';

const api = "http://localhost:8080";

const getApiUrl = (role) => {
  switch (role) {
    case 'GYMMANAGEMENT':
      return `${api}/api/gym-management/login`;
    case 'TRAINER':
      return `${api}/api/trainers/login`;
    case 'MEMBER':
      return `${api}/api/members/login`;
    default:
      throw new Error('Unknown role');
  }
};

const Login = (props) => {
  const { role } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const requestBody = {
      email: email,
      password: password
  };

    try {
      const apiUrl = getApiUrl(role);
      const response = await axios.post(apiUrl, requestBody);
      if (response.status === 200) {
        localStorage.setItem('token', response.data);
        console.log("SAVED TOKEN:", localStorage.getItem('token'));
        navigate("/home");
      }
      setMessage('Login successful');
    } catch (error) {
      setMessage('Login failed: ' + error.response.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='youremail@mail.com'
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='********'
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
    </div>
  );
};

export default Login;
