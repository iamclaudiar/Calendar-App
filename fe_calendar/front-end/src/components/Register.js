import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = "http://localhost:8080";

const skillsOptions = ["FITNESS", "ZUMBA", "YOGA", "PILATES"];

const getApiUrl = (role) => {
    switch (role) {
      case 'GYMMANAGEMENT':
        return `${api}/api/gym-management/register`;
      case 'TRAINER':
        return `${api}/api/trainers/register`;
      case 'MEMBER':
        return `${api}/api/members/register`;
      default:
        throw new Error('Unknown role');
    }
  };

const Register = (props) => {
  const { role } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false
  });

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const requestBodyTrainer = {
        name: name,
        email: email,
        password: password,
        skills: skills
    };

    const requestBody = {
        name: name,
        email: email,
        password: password
    };

    try {
      const apiUrl = getApiUrl(role);
      var response;
      
      if(role === "TRAINER") {
        response = await axios.post(apiUrl, requestBodyTrainer);
      } else {
        console.log(requestBody);
        response = await axios.post(apiUrl, requestBody);
      }

      if (response && response.status === 200) {
        setMessage('Registration successful');
        props.onFormSwitch('login');
      } else {
        setMessage('Registration failed: Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        setMessage('Registration failed: ' + (error.response.data.message || error.response.data));
      } else {
        setMessage('Registration failed: No response from server.');
      }
    }
  };

  const handleSkillChange = (event) => {
    const skill = event.target.value;
    setSkills((prevSkills) => 
      event.target.checked ? [...prevSkills, skill] : prevSkills.filter((s) => s !== skill)
    );
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Full Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='full name' required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='youremail@mail.com' required />
        </div>
        <div>
          <label>Password:</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********' required />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
          <ul>
          <li style={{ color: passwordValidations.length ? 'green' : 'red' }}>
              At least 8 characters
            </li>
            <li style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>
              At least one uppercase character
            </li>
            <li style={{ color: passwordValidations.lowercase ? 'green' : 'red' }}>
              At least one lowercase character
            </li>
            <li style={{ color: passwordValidations.digit ? 'green' : 'red' }}>
              At least one digit
            </li>
            <li style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
              At least one special character
            </li>
          </ul>
        </div>
        { role === 'TRAINER' && (
        <div>
          <label>Skills:</label>
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
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
  );
};

export default Register;
