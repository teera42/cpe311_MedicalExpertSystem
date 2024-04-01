import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Factdesign.css'; // Import your CSS file
import Modal from '../Modal/Createfact';
import Modalwarn from '../Modal/Warnningrole'
function Fact() {
  const [records, setRecords] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null); // Add state for error handling
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);
 
    const loggedInUsername = localStorage.getItem('userlogin');
  const fetchData = () => {
    axios.get('http://localhost:3030/fact')
      .then(res => {
        console.log('Fetched records:', res.data); // Log fetched records
        setRecords(res.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message); // Set error state if fetching data fails
      });
  };
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
  const handleCreateModalOpen = () => {
    setOpenModal(true);
    setSelectedRecord(null); // Clear selected record when opening modal for creation
  };

  const handleEditModalOpen = (record) => {
    setOpenModal(true);
    setSelectedRecord(record); // Set selected record when opening modal for editing
  };

  const handleCreate = (newRecord) => {
    axios.post('http://localhost:3030/fact', newRecord)
      .then(res => {
        console.log('Record created successfully:', res.data);
        setOpenModal(false); // Close the modal after successful creation
        fetchData(); // Refresh the records
      })
      .catch(error => {
        console.error('Error creating record:', error);
        setError(error.message); // Set error state if creating record fails
      });
  };

  const handleEdit = (editedRecord) => {
    axios.put(`http://localhost:3030/fact/${editedRecord.id}`, editedRecord)
      .then(res => {
        console.log('Record edited successfully:', res.data);
        setOpenModal(false); // Close the modal after successful editing
        fetchData(); // Refresh the records
      })
      .catch(error => {
        console.error('Error editing record:', error);
        setError(error.message); // Set error state if editing record fails
      });
  };

  const handleDelete = (recordId) => {
    axios.delete(`http://localhost:3030/fact/${recordId}`)
      .then(res => {
        console.log('Record deleted successfully:', res.data);
        fetchData(); // Refresh the records
      })
      .catch(error => {
        console.error('Error deleting record:', error);
        setError(error.message); // Set error state if deleting record fails
      });
  };

  return (
    <div className='container'>
      <h2>All Fact<button onClick={handleCreateModalOpen}>Create</button></h2>
      {error && <div>Error: {error}</div>} {/* Display error message if an error occurs */}
      {openModal && <Modal
        closeModal={() => setOpenModal(false)}
        record={selectedRecord}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />}{userRole === 'User' && <Modalwarn />}
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.Name}</td>
              <td>{record.Description}</td>
              <td>
                <button className='edit-butt' onClick={() => handleEditModalOpen(record)}>Edit</button>
                <button className='delete-butt' onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Fact;
