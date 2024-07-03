import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Menu from './Menu';

const api = "http://localhost:8080";

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [address, setAddress] = useState('');
  const [editId, setEditId] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUserName] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      setUserName(decodedToken.name);
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(api + "/api/locations", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const addLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(api + "/api/locations", { building, room, address }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations([...locations, response.data]);
      setBuilding('');
      setRoom('');
      setAddress('');
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const updateLocation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(api + `/api/locations/${editId}`, { building, room, address }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(locations.map(location => (location.id === editId ? response.data : location)));
      setBuilding('');
      setRoom('');
      setAddress('');
      setEditId(null);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const deleteLocation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(api + `/api/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(locations.filter(location => location.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateLocation();
    } else {
      addLocation();
    }
  };

  const handleEdit = (location) => {
    setBuilding(location.building);
    setRoom(location.room);
    setAddress(location.address);
    setEditId(location.id);
  };

  return (
    <div>
      <Menu username={username}/>
      <h1>Locations</h1>
      { role === 'GYMMANAGEMENT' && (
      <form onSubmit={handleSubmit}>
        <h3>Add a new location:</h3>
        <label>Building: </label>
        <input
          type="text"
          placeholder="Building"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          required
        />
        <br/>
        <label>Room: </label>
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <br/>
        <label>Address: </label>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br/>
        <button type="submit">{editId ? 'Update' : 'Add'} Location</button>
      </form>
      )}
      <h3>All locations:</h3>
      <ul>
        {locations.map(location => (
          <li key={location.id}>
            <strong>Building: </strong>{location.building} 
            <br/>
            <strong>Room: </strong>{location.room}
            <br/>
            <strong>Address: </strong>{location.address}
            <br/>

          { role === 'GYMMANAGEMENT' && (  
          <div>  
            <button onClick={() => handleEdit(location)}>Edit</button>
            <button onClick={() => deleteLocation(location.id)}>Delete</button>
          </div>
          )}
          <br/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationManager;
