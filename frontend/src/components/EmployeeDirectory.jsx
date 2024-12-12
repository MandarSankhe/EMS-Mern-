import React, { useState, useEffect } from 'react';
import EmployeeTable from './EmployeeTable';
import EmployeeSearch from './EmployeeSearch'; // Assuming you have this component for filtering employees

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from the API
  const fetchEmployees = () => {
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            employees {
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error('Error fetching employees:', data.errors);
        } else {
          setEmployees(data.data.employees || []);
        }
      })
      .catch((err) => console.error('Network error:', err));
  };

  // Handle deletion of an employee
  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((employee) => employee.id !== employeeId));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      {/* Banner Section */}
      <div className="bg-primary text-white py-5 mb-4 shadow">
        <div className="container text-center">
          <h1 className="fw-bold">Employee Management System</h1>
          <p className="lead">Manage and track your workforce effectively</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container">
        <EmployeeSearch setEmployees={setEmployees} />
        <EmployeeTable employees={employees} onDeleteEmployee={handleDeleteEmployee} />
      </div>
    </>
  );
};

export default EmployeeDirectory;
