import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../style/Style.css';
import { jwtDecode } from "jwt-decode";

const Menu = ({ username }) => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setRole(decodedToken.role);
        }
      }, []);

      const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logged out');
        navigate("/");
    };

  return (
    <div className="menu">
      <span>Hello, {username}!</span>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">My profile</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        
        { role === 'GYMMANAGEMENT' && (
          <li><Link to="/members">All members</Link></li>
        )}
        <li><Link to="/trainers">All trainers</Link></li>
        <li><Link to="/locations">Locations</Link></li>
        <li><button onClick={handleLogout}>Log Out</button></li>
      </ul>
    </div>
  );
};

export default Menu;

