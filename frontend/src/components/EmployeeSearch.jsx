import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Container } from 'react-bootstrap';

const EmployeeSearch = ({ setEmployees }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');

  // Extract the "type" query parameter from the URL
  const type = new URLSearchParams(location.search).get('type') || '';

  // Update the selected dropdown value when the query parameter changes
  useEffect(() => {
    setSelectedType(type);
  }, [type]);

  // Fetch employees when "type" changes
  useEffect(() => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($type: String) {
            employees(type: $type) {
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
        variables: { type: type || null },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error('GraphQL Error:', data.errors);
          setEmployees([]);
        } else {
          setEmployees(data.data.employees || []);
        }
      })
      .catch((err) => {
        console.error('Network Error:', err);
        setEmployees([]);
      });
  }, [type, setEmployees]);

  // Handle dropdown change and update the query parameter
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    navigate(`?type=${newType}`); // Update the URL without reloading
  };

  return (
    <Container className="mb-4 d-flex align-items-center">
      <h6 className="filter-column-1">Filter Employees</h6>
      <Form.Select
        value={selectedType}
        onChange={handleTypeChange}
        className="w-50 filter-column-2"
      >
        <option value="">All</option>
        <option value="FullTime">Full-Time</option>
        <option value="PartTime">Part-Time</option>
        <option value="Contract">Contract</option>
        <option value="Seasonal">Seasonal</option>
      </Form.Select>
    </Container>
  );
};

export default EmployeeSearch;
