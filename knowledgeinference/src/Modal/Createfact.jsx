import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Createfactdesign.css'; // Import your CSS file

function Createfact({ closeModal, record }) {
  const [formData, setFormData] = useState({ Name: '', Description: '' });

  useEffect(() => {
    if (record) {
      setFormData(record); // Populate form fields with record data when editing
    } else {
      // Clear form fields when no record is selected
      setFormData({ Name: '', Description: '',booleancase:'' });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Name, Description,booleancase } = formData;
    const newRecord = { Name, Description,booleancase };
  
    if (record) {
      // If record exists, it's an edit operation
      axios.put(`http://localhost:3030/fact/${record.id}`, newRecord)
        .then(res => {
          console.log('Record edited successfully:', res.data);
          closeModal(); // Close the modal after successful editing
        })
        .catch(error => {
          console.error('Error editing record:', error);
        });
    } else {
      // If no record exists, it's a create operation
      axios.post('http://localhost:3030/fact', newRecord)
        .then(res => {
          console.log('Record created successfully:', res.data);
          closeModal(); // Close the modal after successful creation
        })
        .catch(error => {
          console.error('Error creating record:', error);
        });
    }
  };
  
  return (
    <div className="modalfact">
      <div className="modal-contentfact">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>{record ? 'Edit' : 'Create'} Fact</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group-addfact'>
            <label htmlFor="Name" style={{textAlign:'left'}}>Name</label>
            <input  required type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder='Enter name fact'/>
          </div>
          <div className='form-group-addfact'>
            <label htmlFor="Description" style={{textAlign:'left'}}>Description</label>
            <input required type="text" name="Description" value={formData.Description} onChange={handleChange} placeholder='Enter description' />
          </div> 
          <div className='align-btn-submit'>
            <button type="button" className='btn-cancel-admin' onClick={() => closeModal(false)} style={{ color: 'black', backgroundColor: '#EFEFEF' }}>
              Cancel
            </button>
            <button type="submit" className='btn-submit'>
              {record ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Createfact;
