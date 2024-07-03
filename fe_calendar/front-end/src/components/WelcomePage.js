import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div>
      <h1>You are: </h1>
      <ul>
        <li><Link to="/login-member">Member</Link></li>
        <li><Link to="/login-trainer">Trainer</Link></li>
        <li><Link to="/login-gym-management">Gym Management</Link></li>
      </ul>
    </div>
  );
};

export default LoginPage;