import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom'; 
import io from 'socket.io-client';
import axios from 'axios';
import './Signin-up.css';

const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const navigate = useNavigate();
  const [error,setError] = useState(""); 

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
    try {
      const apiEndpoint = `${socket.io.uri}/api/users/signup`;
      const response = await axios.post(apiEndpoint, {
        username,
        password,
        email,
      });
      alert(response.data.message);
      navigate('/signin');
    } catch (error) {
      const backendError = error.response?.data?.error || 'Signup failed due to unknown error';
      console.log(error);
      setError(backendError);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
      <form onSubmit={handleSubmit}>
      <h2 className="signup-title"> Register </h2>
      <p className="line"></p>
          <div className="error-message"><p>{error}</p></div>
          <div className="signup-fields">
          <label htmlFor="username"> {" "} <b>Username</b></label>
          <input
          className="signup-textbox"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsername}
          />
          {usernameAvailable !== null && (
            <span className={usernameAvailable ? 'username-available' : ''}>
              {usernameAvailable ? 'Username available' : 'Username taken'}
            </span>
          )}
        <label htmlFor="password"> <b>Password</b></label>
          <input
          className="signup-textbox"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="email">{" "}<b>Email</b></label>
          <input
          className="signup-textbox"
          placeholder="Enter Email" 
            type="email"  // Use email input type
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required  // Make email field required
          />
        </div>
        <button className="signup-button" type="submit">Signup</button>
      </form>
      <div className="signup-option">
          <p className="signup-question">
            Have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
    </div>
    </div>
  );
};

export default Signup;
