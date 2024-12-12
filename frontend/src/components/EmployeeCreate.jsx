import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function EmployeeCreate() {
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: name === 'age' ? parseInt(value, 10) : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation rules
    if (!employeeData.firstName) newErrors.firstName = 'First Name is required';
    if (!employeeData.lastName) newErrors.lastName = 'Last Name is required';
    if (employeeData.age < 20 || employeeData.age > 70)
      newErrors.age = 'Age must be between 20 and 70';
    if (!employeeData.dateOfJoining) newErrors.dateOfJoining = 'Date of Joining is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateEmployee($input: EmployeeInput!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
              age
              dateOfJoining
              title
              department
              employeeType
              currentStatus
            }
          }
        `,
        variables: { input: employeeData },
      }),
    });

    const { data } = await response.json();
    if (data) {
      alert('Employee created successfully');
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Create New Employee</h2>
        <p className="text-muted">Fill in the details below to add a new employee.</p>
      </div>

      {/* Back to Home Button */}
      <div className="mb-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/')} // Navigate to home page
        >
          Back to Home
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
        <div className="row">
          {/* First Name */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="Enter first name"
              value={employeeData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              placeholder="Enter last name"
              value={employeeData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        <div className="row">
          {/* Age */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className={`form-control ${errors.age ? 'is-invalid' : ''}`}
              placeholder="Enter age"
              min="20"
              max="70"
              value={employeeData.age}
              onChange={handleInputChange}
            />
            {errors.age && <div className="invalid-feedback">{errors.age}</div>}
          </div>

          {/* Date of Joining */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
              value={employeeData.dateOfJoining}
              onChange={handleInputChange}
            />
            {errors.dateOfJoining && (
              <div className="invalid-feedback">{errors.dateOfJoining}</div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Title */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">Title</label>
            <select
              name="title"
              className="form-select"
              value={employeeData.title}
              onChange={handleInputChange}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="VP">VP</option>
            </select>
          </div>

          {/* Department */}
          <div className="col-md-6 col-sm-12 mb-3">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-select"
              value={employeeData.department}
              onChange={handleInputChange}
            >
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Employee Type */}
          <div className="col-md-6 col-sm-12 mb-4">
            <label className="form-label">Employee Type</label>
            <select
              name="employeeType"
              className="form-select"
              value={employeeData.employeeType}
              onChange={handleInputChange}
            >
              <option value="FullTime">Full-Time</option>
              <option value="PartTime">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg px-5">
            Create Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeCreate;
