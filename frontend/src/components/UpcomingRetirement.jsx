import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';

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
                monthsUntilRetirement,
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
        <div className="container text-center">
          <h1 className="fw-bold">Upcoming Retirements</h1>
          <p className="text-muted">Monitor employees retiring in the next 6 months</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container">
        <div className="mb-3">
          <label htmlFor="employeeTypeFilter" className="form-label">Filter by Employee Type:</label>
          <select 
            id="employeeTypeFilter" 
            className="form-select" 
            onChange={handleEmployeeTypeFilterChange}
          >
            <option value="All">All</option>
            <option value="FullTime">Full Time</option>
            <option value="PartTime">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>

        {/* Display error message if there's an error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Display retiring employees if available */}
        {!error && retiringEmployees.length > 0 ? (
          <EmployeeTable 
            employees={retiringEmployees} 
            showLink={false} 
            additionalColumns={[
              { header: 'Retirement Date', key: 'retirementDate' },
              { header: 'Months Until Retirement', key: 'monthsUntilRetirement' },
            ]}
          />
        ) : (
          !error && (
            <div className="alert alert-warning">No employees retiring in the next 6 months.</div>
          )
        )}

        <button className="btn btn-primary mt-3" onClick={() => navigate('/employees')}>
          Back to Employees
        </button>
      </div>
    </>
  );
};

export default UpcomingRetirement;
