import React, { useEffect, useState } from 'react';
import EmployeeSearch from './EmployeeSearch';
import EmployeeCreate from './EmployeeCreate';
import EmployeeTable from './EmployeeTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gql, useQuery } from '@apollo/client';

const GET_EMPLOYEES = gql`
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
`;
function EmployeeDirectory() {
  
  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (data && data.employees) {
      setEmployees(data.employees);
    }
  }, [data]);

  const addEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Banner with bg-info for the welcome text */}
      <div className="bg-info text-white text-center py-4 mb-4 shadow-lg">
        <h1 className="display-4">Employee Management System</h1>
      </div>

      {/* Main container */}
      <div className="container">
        {/* Employee Search component */}
        <EmployeeSearch />

        {/* Create and Table section */}
        <div className="row mt-5">
          {/* Employee Create form on the left side */}
          <div className="col-md-6 col-sm-12 mb-4">
            <EmployeeCreate addEmployee={addEmployee}/>
          </div>

          {/* Employee Table on the right side */}
          <div className="col-md-6 col-sm-12">
            <EmployeeTable employees={employees}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDirectory;
