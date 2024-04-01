import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Ruledesign.css'; // Import your CSS file
import Modal from '../Modal/Createrule';
import Modalwarn from '../Modal/Warnningrole'

function Rulepage() {
  const [openModal, setOpenModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user data and records when component mounts
    fetchUserData();
    fetchRecords();
  }, []);

  useEffect(() => {
    // Fetch user data when the component mounts or when user login changes
    const loggedInUsername = localStorage.getItem('userlogin');
    fetchUserData(loggedInUsername);
  }, []);

  // Fetch records function
  const fetchRecords = () => {
    axios.get('http://localhost:3030/rule')
      .then(res => {
        setRecords(res.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  const loggedInUsername  = localStorage.getItem('userlogin');
  // Fetch user data function
  // Fetch user data function
const fetchUserData = () => {
  axios.get('http://localhost:3030/userdata')
    .then(res => {
      const userData = res.data;
      if (userData) {
        const currentUser = userData.find(user => user.username === loggedInUsername);
        if (currentUser) {
          setUserRole(currentUser.role);
        } else {
          console.error('Logged-in user not found');
        }
      } else {
        console.error('User data is null or undefined');
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
};


  // Add rule function
  const addRule = (newRule) => {
    axios.post('http://localhost:3030/rule', newRule)
      .then(res => {
        fetchRecords();
      })
      .catch(error => {
        console.error('Error adding rule:', error);
      });
  };

  // Delete rule function
  const deleteRule = (id) => {
    axios.delete(`http://localhost:3030/rule/${id}`)
      .then(res => {
        fetchRecords();
      })
      .catch(error => {
        console.error('Error deleting rule:', error);
      });
  };

  // Edit rule function
  const editRule = (updatedRule) => {
    axios.put(`http://localhost:3030/rule/${updatedRule.id}`, updatedRule)
      .then(res => {
        fetchRecords();
        setSelectedRule(null);
      })
      .catch(error => {
        console.error('Error updating rule:', error);
      });
  };

  // Toggle modal function
  const toggleModal = () => {
    setOpenModal(!openModal);
    setSelectedRule(null);
  };

  // Handle edit function
  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setOpenModal(true);
  };

  return (
    <div className='container'>
      <h2>All Rule<button onClick={toggleModal}>Create</button></h2>
      {openModal && <Modal closeModal={toggleModal} addRule={addRule} editRule={editRule} selectedRule={selectedRule} />}
      {userRole === 'User' && <Modalwarn />}
      <table className='table'>
        <thead>
          <tr>
            {/* Table headers */}
            <th>1st Premise</th>
            <th>Operation</th>
            <th>2nd Premise</th>
            <th>1st Conclude</th>
            <th>Operation Conclude</th>
            <th>2nd Conclude</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows */}
          {records.map((d, i) => (
            <tr key={i}>
              <td>{d.premise1}</td>
              <td>{d.operation}</td>
              <td>{d.premise2}</td>
              <td>{d.conclude1}</td>
              <td>{d.operationconclude}</td>
              <td>{d.conclude2}</td>
              <td>
                {/* Edit and Delete buttons */}
                <button className='edit-butt' onClick={() => handleEdit(d)}>Edit</button>
                <button className='delete-butt' onClick={() => deleteRule(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rulepage;
