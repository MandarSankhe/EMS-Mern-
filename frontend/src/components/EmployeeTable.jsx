import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ employees, onDeleteEmployee }) => {
  const handleDelete = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Network error: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          const message = data?.data?.deleteEmployee?.message;

          if (message === "CAN’T DELETE EMPLOYEE – STATUS ACTIVE") {
            alert(message); // Show the message to the user
          } else if (message === "Employee deleted successfully") {
            alert(message); // Show success message
            onDeleteEmployee(employeeId); // Refresh the list
          } else {
            alert(message || "An unknown error occurred.");
          }
        })
        .catch((err) => {
          console.error("Error deleting employee:", err);
          alert("An error occurred while deleting the employee.");
        });
    }
  };

  const calculateAge = (dateOfBirth) => {
    console.log(dateOfBirth)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1; // Adjust for an incomplete year
    }
    return age;
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
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
              <td colSpan="10" className="text-center">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                <td>{calculateAge(employee.dateOfBirth)}</td>
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
