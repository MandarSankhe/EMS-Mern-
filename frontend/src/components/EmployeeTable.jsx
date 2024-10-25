import React from 'react';
import { gql, useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';



function EmployeeTable({employees }) {

  // Check if employees array is empty
  if (employees.length === 0) {
    return (
      <div>
        <h2 className="mb-4">Employee List</h2>
        <p className="alert alert-warning">No records found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Employee List</h2>
      <table className="table table-bordered table-striped table-hover shadow">
        <thead className="thead-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Current Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.age}</td>
              <td>{new Date(employee.dateOfJoining).toISOString().split('T')[0]}</td>
              <td>{employee.title}</td>
              <td>{employee.department}</td>
              <td>{employee.employeeType}</td>
              <td>{employee.currentStatus ? 'Working' : 'Retired'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
