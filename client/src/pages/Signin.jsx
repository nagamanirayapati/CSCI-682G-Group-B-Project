import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import io from 'socket.io-client';
import './Signin-up.css';

// Connect to the server's socket
const socket = io.connect("http://localhost:5000");

const Signin = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true); // For username validation
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for username availability or any other real-time events
    socket.on('emailChecked', (data) => {
      setIsEmailValid(data.isValid);
    });

    return () => {
      socket.off('emailChecked');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiEndpoint = `http://localhost:5000/api/users/signin`;
      const response = await axios.post(apiEndpoint, {
        email,
        password,
      });

      // If sign-in is successful, set user
      const user = response.data.user;
      console.log('User Info:', user);
      alert(response.data.message); 
      navigate('/Home', { state: { user } });
    } catch (error) {
      const backendError = error.response?.data?.error || 'Sign-in failed due to unknown error';
      console.log(error);
      setError(backendError);
    }
  };

  const checkEmail = () => {
    socket.emit('checkEmail', email); // Send the username to the server to check its validity
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <form onSubmit={handleSubmit}>
          <h2 className="signin-title"> Log in</h2>
          <p className="line"></p>
          <div className="error-message"><p>{error}</p></div>
          <div className="signin-fields">
            <label htmlFor="email"> <b>Email</b></label>
             <input
             className='signin-textbox'
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmail} // Trigger email check when input loses focus
            required
          />
          <label htmlFor="password"><b>Password</b></label>
          <input
          className='signin-textbox' 
            type="password"
            value={password}
            placeholder="Enter Password" 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
        <button className="signin-button" type="submit">Sign In</button>
      </form>
      <div className='signup-option'>
        <p className="signup-question">Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        </div>
    </div>
    </div>
  );
};

export default Signin;