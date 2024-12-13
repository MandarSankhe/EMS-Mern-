import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Badge, Button, Modal } from 'react-bootstrap';

const EmployeeTable = ({ employees, onDeleteEmployee }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setModalMessage("Are you sure you want to delete this employee?");
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployeeId) {
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
          variables: { id: selectedEmployeeId },
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
            setModalMessage(message);
          } else if (message === "Employee deleted successfully") {
            setModalMessage(message);
            onDeleteEmployee(selectedEmployeeId);
          } else {
            setModalMessage(message || "An unknown error occurred.");
          }
        })
        .catch((err) => {
          console.error("Error deleting employee:", err);
          setModalMessage("An error occurred while deleting the employee.");
        });
    }
  };

  const calculateAge = (dateOfBirth) => {
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
      <Table striped hover bordered className="mt-4">
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
                  <Badge bg={employee.currentStatus ? 'success' : 'danger'}>
                    {employee.currentStatus ? 'Working' : 'Retired'}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex">
                    <Link
                      to={`/employee/${employee.id}`}
                      className="me-2 btn btn-primary btn-sm"
                    >
                      Details
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(employee.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          {modalMessage === "Are you sure you want to delete this employee?" ? (
            <>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
