import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  fetchEmployees,
  fetchFilterOptions,
  deleteEmployee,
  setSearch,
  setDepartment,
  setDesignation,
  setSort,
  setPage,
  resetPageToOne,
  clearFilters,
} from '../store/slices/employeeSlice';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    employees,
    filterOptions,
    search,
    department,
    designation,
    sortBy,
    order,
    page,
    pagination,
    loading,
    error,
    deletingId,
  } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(resetPageToOne());
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, designation]);

  useEffect(() => {
    dispatch(fetchEmployees());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, designation, sortBy, order, page]);

  const sortIndicator = (field) => {
    if (sortBy !== field) return '';
    return order === 'asc' ? ' ▲' : ' ▼';
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    dispatch(deleteEmployee(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="employee-list-page">
      <header className="page-header">
        <h2>Employees {user ? `— ${user.name}` : ''}</h2>
        <div className="header-actions">
          <Link to="/employees/new">
            <button>+ Add Employee</button>
          </Link>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="search-input"
        />

        <select value={department} onChange={(e) => dispatch(setDepartment(e.target.value))}>
          <option value="">All Departments</option>
          {filterOptions.departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select value={designation} onChange={(e) => dispatch(setDesignation(e.target.value))}>
          <option value="">All Designations</option>
          {filterOptions.designations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {(search || department || designation) && (
          <button className="btn-secondary" onClick={() => dispatch(clearFilters())}>
            Clear Filters
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => dispatch(setSort('fullName'))}>
                  Full Name{sortIndicator('fullName')}
                </th>
                <th className="sortable" onClick={() => dispatch(setSort('email'))}>
                  Email{sortIndicator('email')}
                </th>
                <th>Mobile</th>
                <th className="sortable" onClick={() => dispatch(setSort('department'))}>
                  Department{sortIndicator('department')}
                </th>
                <th className="sortable" onClick={() => dispatch(setSort('designation'))}>
                  Designation{sortIndicator('designation')}
                </th>
                <th className="sortable" onClick={() => dispatch(setSort('joiningDate'))}>
                  Joining Date{sortIndicator('joiningDate')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobileNumber}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/employees/${emp._id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(emp._id)}
                      disabled={deletingId === emp._id}
                    >
                      {deletingId === emp._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-bar">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
            </span>
            <div className="pagination-controls">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => dispatch(setPage(page - 1))}
              >
                Previous
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => dispatch(setPage(page + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;