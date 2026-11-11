import React, { useState, useEffect } from 'react';

const emptyForm = {
  fullName: '',
  email: '',
  mobileNumber: '',
  department: '',
  designation: '',
  joiningDate: '',
};

const EmployeeForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        mobileNumber: initialData.mobileNumber || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        joiningDate: initialData.joiningDate ? initialData.joiningDate.slice(0, 10) : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }
    if (!form.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!form.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    if (!form.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          id="mobileNumber"
          name="mobileNumber"
          value={form.mobileNumber}
          onChange={handleChange}
          maxLength={10}
        />
        {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <input id="department" name="department" value={form.department} onChange={handleChange} />
        {errors.department && <span className="error-text">{errors.department}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="designation">Designation</label>
        <input id="designation" name="designation" value={form.designation} onChange={handleChange} />
        {errors.designation && <span className="error-text">{errors.designation}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="joiningDate">Joining Date</label>
        <input
          id="joiningDate"
          name="joiningDate"
          type="date"
          value={form.joiningDate}
          onChange={handleChange}
        />
        {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
