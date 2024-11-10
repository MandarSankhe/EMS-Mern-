import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    currentStatus: true,
  });

  React.useEffect(() => {
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetEmployee($id: ID!) {
            employee(id: $id) {
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
        variables: { id },
      }),
    })
      .then((res) => res.json())
      .then((data) => setEmployee(data.data.employee));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'currentStatus' ? value === 'true' : value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      title: employee.title,
      department: employee.department,
      currentStatus: employee.currentStatus,
    });
  };

  const handleSave = () => {
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
            updateEmployee(id: $id, input: $input) {
              id
              title
              department
              currentStatus
            }
          }
        `,
        variables: { id, input: formData },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployee({ ...employee, ...data.data.updateEmployee });
        setIsEditing(false);
      });
  };

  const handleDelete = () => {
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
        variables: { id },
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowDeleteModal(false);
        navigate('/'); // Redirect after deletion
      });
  };

  if (!employee) return (
    <div className="text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3>{employee.firstName} {employee.lastName}</h3>
        </div>
        <div className="card-body">
          {isEditing ? (
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Title</label>
                  <select
                    name="title"
                    className="form-select"
                    value={formData.title}
                    onChange={handleInputChange}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="VP">VP</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Department</label>
                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Status</label>
                  <select
                    name="currentStatus"
                    className="form-select"
                    value={formData.currentStatus.toString()}
                    onChange={handleInputChange}
                  >
                    <option value="true">Working</option>
                    <option value="false">Retired</option>
                  </select>
                </div>
              </div>
              <button type="button" className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>First Name:</strong> {employee.firstName}</p>
              <p><strong>Last Name:</strong> {employee.lastName}</p>
              <p><strong>Age:</strong> {employee.age}</p>
              <p><strong>Date of Joining:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
              <p><strong>Title:</strong> {employee.title}</p>
              <p><strong>Department:</strong> {employee.department}</p>
              <p><strong>Employee Type:</strong> {employee.employeeType}</p>
              <p><strong>Status:</strong> {employee.currentStatus ? 'Working' : 'Retired'}</p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-warning" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Employee List
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this employee?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
