// Navbar.js
import React from 'react';
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom';
import logo from '../picture/artificial.png';
import chatlogo from '../picture/chat.png';
import brainlogo from '../picture/brain.png';
import knowledgelogo from '../picture/knowledge.png';
import aboutlogo from '../picture/about.png';
import { FaUserCircle } from "react-icons/fa";
function Navbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/';
  if (hideNavbar) {
    return null;
  }
  const usernamelogin = localStorage.getItem('userlogin');
  return (
    <div className='navbar'>
      <div className='nav-logo'><img src={logo} alt="" /></div>
      <div className='nav-headname'>Medical Expert System</div>
      <ul className='nav-menu'>
        <li><Link className='menu-deco' to='/chatpage'><img src={chatlogo} alt="" style={{width:'2.5rem',height:'2.5rem'}} /><hr />CHAT</Link></li>
        <li><Link className='menu-deco' to='/fact'><img src={knowledgelogo} alt="" style={{width:'2.5rem',height:'2.5rem'}}/><hr />FACT</Link></li>
        <li><Link className='menu-deco' to='/rule'><img src={brainlogo} alt="" style={{width:'2.5rem',height:'2.5rem'}}/><hr />RULE</Link></li>
        <li><Link className='menu-deco' to='/aboutus'><img src={aboutlogo} alt="" style={{width:'2.5rem',height:'2.5rem'}}/><hr />ABOUT US</Link></li>
        <li><FaUserCircle style={{width:'30px',height:'30px'}} /> {usernamelogin}</li>
      </ul>
    </div>
  );
}

export default Navbar;
