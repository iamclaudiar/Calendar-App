import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Menu from './Menu';
import '../style/Style.css';

const api = "http://localhost:8080";

const Trainer = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState({});
  const [showEvents, setShowEvents] = useState({});
  const [username, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await axios.get(api + `/api/trainers/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const initialEventsState = {};
        const initialShowEventsState = {};
        response.data.forEach(user => {
          initialEventsState[user.id] = [];
          initialShowEventsState[user.id] = false;
        });
        setUsers(response.data);
        setEvents(initialEventsState);
        setShowEvents(initialShowEventsState);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name);
    }
  }, []);

  const handleViewEvents = async (trainerId) => {
    const token = localStorage.getItem('token');
    try {
      const currentShowEventsState = showEvents[trainerId];
      const updatedShowEventsState = { ...showEvents, [trainerId]: !currentShowEventsState };

      if (!currentShowEventsState || !events[trainerId].length) {
        const response = await axios.get(api + `/api/events/trainer/${trainerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const updatedEvents = { ...events, [trainerId]: response.data };
        setEvents(updatedEvents);
      }

      setShowEvents(updatedShowEventsState);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Menu username={username}/>
      <h1>List of trainers</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p><strong>Name: </strong>{user.name}</p>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Skills: </strong>{user.skills.join(", ")}</p>
            <button onClick={() => handleViewEvents(user.id)}>
              {showEvents[user.id] ? 'Hide Events' : 'View Events'}
            </button>
            {showEvents[user.id] && events[user.id].length > 0 && events[user.id].map(event => (
              <div key={event.id}>
                <p>Title: {event.title}</p>
                <p>Description: {event.description}</p>
                <p>Start Time: {event.startTime}</p>
                <p>End Time: {event.endTime}</p>
                <p>Type: {event.type} </p>
                <hr />
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trainer;
