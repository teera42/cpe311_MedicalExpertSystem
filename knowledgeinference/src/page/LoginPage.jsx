import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../picture/artificial.png'
import './Login.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'User'
  });
  const [userData, setUserData] = useState(null); // Store user data locally
  const [usernameError, setUsernameError] = useState(false); // Track username error
  const [passwordError, setPasswordError] = useState(false); // Track password error
  
  useEffect(() => {
    // Fetch user data once when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3030/userdata');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Run only once when the component mounts

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Reset errors when user starts typing
    setUsernameError(false);
    setPasswordError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return; // Check if user data is available

    const { username, password } = formData;
    const user = userData.find(user => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('userlogin', username)
      navigate('/chatpage');
    } else {
      // Invalid credentials
      if (!user) setUsernameError(true); // Set username error state
      if (user && user.password !== password) setPasswordError(true);
      alert('Username or password not correct') // Set password error state
    }
  };

  return (
    <div className='login'>
      <div className='login-contain'>
        <h1 className=''>LOGIN</h1>
        <img src={logo} alt="" style={{width:'5rem',height:'5rem'}}/>
        <form className="login-fields" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name='username'
              value={formData.username}
              onChange={handleChange}
              minLength="6"
              maxLength='30'
              placeholder="Username"
              className={`form-control ${usernameError ? 'error' : ''}`} // Apply error class if usernameError is true
            />
            {usernameError && <p style={{color:'red'}} className="error-message">Username or password not correct</p>} {/* Display error message if usernameError is true */}
          </div>
          <div>
            <input
              type="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              minLength="8"
              maxLength='16'
              className={`form-control ${passwordError ? 'error' : ''}`} // Apply error class if passwordError is true
            />
          </div>
          <div>
            <button type='submit' className="signin-butt">Login Now</button>
          </div>
        </form>
        <div className='login-rolebutt'>
          <div className="">
            <Link to="" style={{ textDecoration: "none", color: "black" }} ><p>Forgot password?</p></Link>
          </div>
          <div className="">
            <Link to="/signup" style={{ textDecoration: "none", color: "black" }}><p>Don't have an account?</p></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;
