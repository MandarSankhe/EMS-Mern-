import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ employees, onDeleteEmployee }) => {
  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation DeleteEmployee($id: ID!) {
              deleteEmployee(id: $id) {
                message
              }
            }
          `,
          variables: { id: employeeId },
        }),
      })
        .then((res) => res.json())
        .then(() => {
          // Call the onDeleteEmployee function to refresh the list
          onDeleteEmployee(employeeId);
        })
        .catch((err) => console.error('Error deleting employee:', err));
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.age}</td>
                <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
                <td>{employee.title}</td>
                <td>{employee.department}</td>
                <td>{employee.employeeType}</td>
                <td>
                  <span
                    className={`badge ${
                      employee.currentStatus ? 'bg-success' : 'bg-danger'
                    }`}
                  >
                    {employee.currentStatus ? 'Working' : 'Retired'}
                  </span>
                </td>
                <td>
                  <div className="d-flex">
                    <Link
                      to={`/employee/${employee.id}`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Details
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
