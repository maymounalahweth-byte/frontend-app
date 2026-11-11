import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import EmployeeForm from '../components/EmployeeForm';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmployee(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (formData) => {
    setError('');
    try {
      await api.put(`/employees/${id}`, formData);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    }
  };

  if (loading) return <p>Loading employee...</p>;

  return (
    <div className="form-page">
      <h2>Edit Employee</h2>
      {error && <p className="error-text">{error}</p>}
      {employee && (
        <EmployeeForm
          initialData={employee}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
          submitLabel="Update Employee"
        />
      )}
    </div>
  );
};

export default EditEmployee;
