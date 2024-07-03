import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const api = "http://localhost:8080";

const skillsOptions = ["FITNESS", "ZUMBA", "YOGA", "PILATES"];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(null);
  const [username, setUserName] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setRole(decodedToken.role);
          const userId = decodedToken.id;
          const apiUrl = getApiUrl(decodedToken.role, userId);
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
          setUserName(decodedToken.name);
          setSkills(response.data.skills);
        } else {
          throw new Error('No token found');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchUser();
  }, []);

  const getApiUrl = (role, userId) => {
    switch(role) {
      case 'GYMMANAGEMENT':
        return `${api}/api/gym-management/${userId}`;
      case 'TRAINER':
        return `${api}/api/trainers/${userId}`;
      case 'MEMBER':
        return `${api}/api/members/${userId}`;
      default:
        throw new Error('Unknown role');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const apiUrl = getApiUrl(decodedToken.role, userId);
        await axios.delete(apiUrl.replace(`/${userId}`, `/delete/${userId}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        localStorage.removeItem('token');
        navigate(`/login`);
      } else {
        throw new Error('No token found');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    let updatedUser = {
      name,
      email,
      password
    };
    
    if (role === "TRAINER") {
      updatedUser = {
      ...updatedUser, skills
      }
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const apiUrl = getApiUrl(decodedToken.role, userId);
      const response = await axios.put(apiUrl.replace(`/${userId}`, `/update/${userId}`), updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleSkillChange = (event) => {
    const skill = event.target.value;
    setSkills((prevSkills) => 
      event.target.checked ? [...prevSkills, skill] : prevSkills.filter((s) => s !== skill)
    );
  };

  return (
    <div>
      <Menu username={username}/>
      <h1>My Profile</h1>
      {user && !isEditing && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {role} </p>
            {role === "TRAINER" && (
              <p><strong>Skills:</strong> {user.skills ? user.skills.join(", ") : ""} </p>
            )}
            <button onClick={() => setIsEditing(true)}>Update profile</button>
            <button onClick={handleDelete}>Delete profile</button>
          </div>
        )}
        {isEditing && (
          <div>
            <h2>Edit Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
            {role === "TRAINER" && (
              <div>
                {skillsOptions.map((skill) => (
            <div key={skill}>
              <label>
                <input 
                  type="checkbox" 
                  value={skill} 
                  onChange={handleSkillChange}
                />
                {skill}
              </label>
            </div>
          ))}
              </div>
            )}
            </div>
            <br />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
    </div>
  );
};

export default Profile;
