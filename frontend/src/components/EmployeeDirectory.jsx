import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EmployeeTable from './EmployeeTable';
import EmployeeSearch from './EmployeeSearch'; // Assuming you have this component for filtering employees

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees from the API
  const fetchEmployees = () => {
    fetch('http://localhost:3000/graphql', {
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
              dateOfJoining
              title
              department
              employeeType
              currentStatus,
              dateOfBirth
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
      <Container fluid className="bg-primary text-white text-center py-5 mb-4">
        <Container>
          <h1 className="fw-bold">Employee Management System</h1>
          <p className="lead">Manage and track your workforce effectively</p>
        </Container>
      </Container>

      {/* Main Content Section */}
      <Container>
        <Row className="mb-3">
          <Col>
            <EmployeeSearch setEmployees={setEmployees} />
          </Col>
        </Row>
        <Row>
          <Col>
            <EmployeeTable employees={employees} onDeleteEmployee={handleDeleteEmployee} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmployeeDirectory;
