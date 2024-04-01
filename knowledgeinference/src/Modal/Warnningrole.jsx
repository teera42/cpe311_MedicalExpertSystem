import React from 'react';
import warnicon from '../picture/warnningicon.png';
import '../Modal/Warningdesign.css';
import { Link, useLocation } from 'react-router-dom';
function Warnningrole() {
  return (
    <div className="modal">
      <div className="modal-content">
        <img className='modal-warn-pic' src={warnicon} alt="Warning Icon" />
        <h2 style={{textAlign:'center',display:'block'}}>No Access</h2>
        <p style={{paddingBottom:'50px'}}> Sorry, you're not allowed to edit this.</p>
        <Link to='/chatpage' >Go back</Link>
      </div>
    </div>
  );
}

export default Warnningrole;
