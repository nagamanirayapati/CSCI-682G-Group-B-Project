import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Signin-up.css';

const socket = io.connect('http://localhost:5000');

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    socket.on('usernameChecked', (data) => {
      setUsernameAvailable(data.isAvailable);
    });

    return () => {
      socket.off('usernameChecked');
    };
  }, []);

  const checkUsername = () => {
    socket.emit('checkUsername', username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Username:', username); // Log username
  console.log('Password:', password);
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        username,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed due to unknown error';
      console.error('Signup failed:', message);
      alert(`Signup failed: ${message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsername}
          />
          {usernameAvailable !== null && (
            <span className={usernameAvailable ? 'username-available' : ''}>
              {usernameAvailable ? 'Username available' : 'Username taken'}
            </span>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
