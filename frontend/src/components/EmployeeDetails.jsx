import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Card,
  Form,
  Modal,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/graphql', {
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
              dateOfJoining
              title
              department
              employeeType
              currentStatus
              dateOfBirth
              retirementDate
              timeUntilRetirement {
                years
                months
                days
              }
            }
          }
        `,
        variables: { id },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error('GraphQL Errors:', data.errors);
          setEmployee(null);
        } else {
          setEmployee(data.data.employee);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employee:', error);
        setEmployee(null);
        setLoading(false);
      });
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
    fetch('http://localhost:3000/graphql', {
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
    fetch('http://localhost:3000/graphql', {
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
        navigate('/');
      });
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /> Loading employee details...
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="mt-5">
        <p>Employee not found.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="mb-4">
        <Button variant="secondary" onClick={() => navigate('/')}>
          <img src="../arrow-left.png" className="nav-logo"/>
          Back to Home
        </Button>
      </div>
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white text-center">
          <h2 className="employee-header">{employee.firstName} {employee.lastName}</h2>
          <p>{employee.title}</p>
        </Card.Header>
        <Card.Body>
          {isEditing ? (
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Select
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Director">Director</option>
                      <option value="VP">VP</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="IT">IT</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">HR</option>
                      <option value="Engineering">Engineering</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="currentStatus"
                      value={formData.currentStatus.toString()}
                      onChange={handleInputChange}
                    >
                      <option value="true">Working</option>
                      <option value="false">Retired</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" className="me-2 edit-buttons" onClick={handleSave}>Save</Button>
              <Button variant="secondary" className="edit-buttons" onClick={() => setIsEditing(false)}>Cancel</Button>
            </Form>
          ) : (
            <div>
              <Row>
                <Col md={6}>
                  <p><strong>First Name:</strong> {employee.firstName}</p>
                  <p><strong>Last Name:</strong> {employee.lastName}</p>
                  <p><strong>Date of Joining:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Title:</strong> {employee.title}</p>
                  <p><strong>Department:</strong> {employee.department}</p>
                  <p><strong>Employee Type:</strong> {employee.employeeType}</p>
                  <p><strong>Status:</strong> {employee.currentStatus ? 'Working' : 'Retired'}</p>
                  {employee.currentStatus && (
                    <>
                      <p><strong>Retirement Date:</strong> {employee.retirementDate}</p>
                      <p><strong>Time Until Retirement:</strong> {employee.timeUntilRetirement.years} years, {employee.timeUntilRetirement.months} months, {employee.timeUntilRetirement.days} days</p>
                    </>
                  )}
                </Col>
              </Row>
              <div className="d-flex justify-content-center mt-4 form-button">
                <Button variant="warning" className="me-3"  size="lg" onClick={handleEdit}>Edit</Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

    </Container>
  );
};

export default EmployeeDetails;
