import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signupdesign.css';
import logo from '../picture/artificial.png'
function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'User',
    email: '',
    firstname: '',
    lastname: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear the error message for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for any missing fields
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        formErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    });

    // If there are missing fields, set errors and prevent submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3030/userdata', formData);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='signup'>
      <form className='signup-contain' onSubmit={handleSubmit}>
        <h1 className=''>SIGN UP</h1>
        <img src={logo} alt="" style={{width:'5rem',height:'5rem'}}/>
        <div className="signup-fields">
          <input type='text' placeholder="Username" name='username' value={formData.username}
            onChange={handleChange} minLength="6" maxLength='30' required />
          {errors.username && <span className="error">{errors.username}</span>}
          <input type='email' value={formData.email}
            onChange={handleChange} placeholder="Email Address" name='email' required />
          {errors.email && <span className="error">{errors.email}</span>}
          <input type="password" value={formData.password}
            onChange={handleChange} placeholder="Password" name='password' minLength="8" maxLength='16' required />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="signup-fields">
          <div className='signup-field-name'>
            <input type='text' placeholder="Firstname" value={formData.firstname}
              onChange={handleChange} name='firstname' required />
            {errors.firstname && <span className="error">{errors.firstname}</span>}
            <input type="text" value={formData.lastname}
              onChange={handleChange} placeholder='Lastname' name='lastname' required />
            {errors.lastname && <span className="error">{errors.lastname}</span>}
          </div>
        </div>
        <button className='regis-butt' type='submit'>REGISTER</button>
        <p className='signup-alr'>Already Registered?<Link to='/' style={{ textDecoration: "none" }}><span className='span-login'>Login here</span></Link></p>
      </form>
    </div>
  );
}

export default SignupPage;
