import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import EmployeeForm from '../components/EmployeeForm';

const AddEmployee = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError('');
    try {
      await api.post('/employees', formData);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
    }
  };

  return (
    <div className="form-page">
      <h2>Add Employee</h2>
      {error && <p className="error-text">{error}</p>}
      <EmployeeForm onSubmit={handleSubmit} onCancel={() => navigate('/employees')} submitLabel="Add Employee" />
    </div>
  );
};

export default AddEmployee;
