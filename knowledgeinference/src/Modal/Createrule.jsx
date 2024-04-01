import React, { useEffect, useState } from 'react';
import './Createrule.css';
import axios from 'axios';

function Createrule({ closeModal, addRule, editRule, selectedRule }) {
  const [factNames, setFactNames] = useState([]);

  useEffect(() => {
    // Fetch fact names when the component mounts
    fetchFactNames();
  }, []);

  const [ruleData, setRuleData] = useState({
    premise1: '',
    operation: '-',
    premise2: '',
    conclude1: '-',
    operationconclude: '-',
    conclude2: '-'
  });

  useEffect(() => {
    // If selectedRule exists (i.e., we are editing), populate the form with its data
    if (selectedRule) {
      setRuleData(selectedRule);
    } else {
      // Otherwise, clear the form data
      setRuleData({
        premise1: '',
        operation: '-',
        premise2: '',
        conclude1: '-',
        operationconclude: '-',
        conclude2: '-'
      });
    }
  }, [selectedRule]);
  
  // Function to fetch fact names from the API
 // Function to fetch fact names from the API
 const fetchFactNames = () => {
  axios.get('http://localhost:3030/fact')
    .then(res => {
      console.log('API Response:', res.data); // Log the entire API response
      if (Array.isArray(res.data)) {
        setFactNames(res.data);
      } else {
        console.error('Error: API response does not contain an array.');
      }
    })
    .catch(error => {
      console.error('Error fetching fact names:', error);
    });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRuleData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
          if (selectedRule) {
        // If selectedRule exists, we are editing, so call editRule
        editRule(ruleData);
      } else {
        // Otherwise, we are adding a new rule
        addRule(ruleData);
      }
      closeModal();
      };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Create Fact</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group-add'>
            <label htmlFor="premise1" style={{textAlign:'left'}}>1st Premise</label>
            <select name='premise1' value={ruleData.premise1} onChange={handleChange}>
              <option value="">-</option> 
              {factNames.map((fact, index) => (
                <option key={index} value={fact.Name}>{fact.Name} ({fact.Description})</option>
              ))}
            </select>
          </div>
          <div className='form-group-add'>
            <label htmlFor="operation" style={{textAlign:'left'}}>Operation</label>
            <select name='operation' value={ruleData.operation} onChange={handleChange}>
              <option value="-">-</option> 
              <option>and</option>
              <option>or</option>
            </select>
          </div> 
          <div className='form-group-add'>
            <label htmlFor="premise2" style={{textAlign:'left'}}>2nd Premise</label>
            <select name='premise2' value={ruleData.premise2} onChange={handleChange}>
              <option value="">-</option> 
              {factNames.map((fact, index) => (
                <option key={index} value={fact.Name}>{fact.Name} ({fact.Description})</option>
              ))}
            </select>
          </div> 
          <div className='form-group-add'>
            <label htmlFor="conclude1" style={{textAlign:'left'}}>1st Conclude</label>
            <select name='conclude1' value={ruleData.conclude1} onChange={handleChange}>
              <option value="-">-</option> 
              {factNames.map((fact, index) => (
                <option key={index} value={fact.Name}>{fact.Name} ({fact.Description})</option>
              ))}
            </select>
          </div> 
          <div className='form-group-add'>
            <label htmlFor="operationconclude" style={{textAlign:'left'}}>Operation</label>
            <select name='operationconclude' value={ruleData.operationconclude} onChange={handleChange}>
              <option value="-">-</option> 
              <option>and</option>
            </select>
          </div>
          <div className='form-group-add'>
            <label htmlFor="conclude2" style={{textAlign:'left'}}>2nd Conclude</label>
            <select name='conclude2' value={ruleData.conclude2} onChange={handleChange}>
              <option value="-">-</option> 
              {factNames.map((fact, index) => (
                <option key={index} value={fact.Name}>{fact.Name} ({fact.Description})</option>
              ))}
            </select>
          </div>
          <div className='align-btn-submit'>
            <button
              className='btn-cancel-admin'
              onClick={() => closeModal(false)}
              style={{ color: 'black', backgroundColor: '#EFEFEF' }}
            >
              Cancel
            </button>
            <button type="submit" className='btn-submit'>
            {selectedRule ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  }

export default Createrule;
