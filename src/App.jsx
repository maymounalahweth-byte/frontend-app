import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/:id/edit"
        element={
          <ProtectedRoute>
            <EditEmployee />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  );
}

export default App;