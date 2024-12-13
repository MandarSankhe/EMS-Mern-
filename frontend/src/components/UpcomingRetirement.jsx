import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import { Container, Button, Alert, Form } from 'react-bootstrap';

const UpcomingRetirement = () => {
  const [retiringEmployees, setRetiringEmployees] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch retiring employees
  const fetchRetiringEmployees = () => {
    const searchParams = new URLSearchParams(location.search);

    // Default to "All" if no valid employeeType is provided
    const employeeType = searchParams.get('employeeType') || 'All';

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
         query GetEmployeesRetiring($withinMonths: Int!, $employeeType: String!) {
            employeesRetiring(withinMonths: $withinMonths, employeeType: $employeeType) {
                id
                firstName
                lastName
                dateOfBirth
                title
                department
                employeeType
                currentStatus
                retirementDate
                timeUntilRetirement {
                  years
                  months
                  days
                }
                dateOfJoining
            }
        }
        `,
        variables: { withinMonths: 6, employeeType },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error('GraphQL Errors:', data.errors);
          setError(data.errors[0]?.message || 'An error occurred while fetching data.');
        } else {
          setRetiringEmployees(data.data.employeesRetiring || []);
        }
      })
      .catch((err) => {
        console.error('Network error:', err);
        setError('Failed to fetch retiring employees. Please try again later.');
      });
  };

  // Handle filter change
  const handleEmployeeTypeFilterChange = (event) => {
    const newEmployeeType = event.target.value;
    navigate(`/upcoming-retirement?employeeType=${newEmployeeType}`); 
  };

  useEffect(() => {
    fetchRetiringEmployees();
  }, [location]);

  return (
    <>
      {/* Banner Section */}
      <div className="bg-primary text-white py-5 mb-4 shadow">
        <Container className="text-center">
          <h1 className="fw-bold">Upcoming Retirements</h1>
          <p className="lead">Monitor employees retiring in the next 6 months</p>
        </Container>
      </div>

      {/* Main Content Section */}
      <Container>
        <div className="mb-3 d-flex align-items-center">
          <Form.Label htmlFor="employeeTypeFilter" className="filter-column-1">Filter Employees</Form.Label>
          <Form.Select 
            id="employeeTypeFilter" 
            onChange={handleEmployeeTypeFilterChange}
            className="w-50 filter-column-2"
          >
            <option value="All">All</option>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </Form.Select>
        </div>

        {/* Display error message if there's an error */}
        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* Display retiring employees if available */}
        {!error && retiringEmployees.length > 0 ? (
          <EmployeeTable 
            employees={retiringEmployees} 
            showLink={false} 
            additionalColumns={[
              { header: 'Retirement Date', key: 'retirementDate' },
              { header: 'Months Until Retirement', key: 'timeUntilRetirement' },
            ]}
          />
        ) : (
          !error && (
            <Alert variant="warning">No employees retiring in the next 6 months.</Alert>
          )
        )}

        <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
          <img src="../arrow-left.png" className="nav-logo"/>
          Back to Employees
        </Button>
      </Container>
    </>
  );
};

export default UpcomingRetirement;
