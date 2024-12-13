import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from 'react-bootstrap';

function EmployeeCreate() {
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dateOfJoining: '',
    title: 'Employee',
    department: 'IT',
    employeeType: 'FullTime',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!employeeData.firstName) newErrors.firstName = 'First Name is required';
    if (!employeeData.lastName) newErrors.lastName = 'Last Name is required';
    if (!employeeData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dob = new Date(employeeData.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 20 || age > 70) {
        newErrors.dateOfBirth = 'Age must be between 20 and 70';
      }
    }
    if (!employeeData.dateOfJoining) newErrors.dateOfJoining = 'Date of Joining is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateEmployee($input: EmployeeInput!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
              dateOfBirth
              dateOfJoining
              title
              department
              employeeType
              currentStatus
            }
          }
        `,
        variables: { input: employeeData },
      }),
    });

    const { data } = await response.json();
    if (data) {
      alert('Employee created successfully');
      navigate('/');
    }
  };

  return (
    <Container className="mt-5">
      <div className="text-center mb-4">
        <h2>Create New Employee</h2>
        <p className="text-muted">Fill in the details below to add a new employee.</p>
      </div>

      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>

      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={employeeData.firstName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={employeeData.lastName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={employeeData.dateOfBirth}
                  onChange={handleInputChange}
                  isInvalid={!!errors.dateOfBirth}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateOfBirth}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Joining</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfJoining"
                  value={employeeData.dateOfJoining}
                  onChange={handleInputChange}
                  isInvalid={!!errors.dateOfJoining}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateOfJoining}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Select
                  name="title"
                  value={employeeData.title}
                  onChange={handleInputChange}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="VP">VP</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={employeeData.department}
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

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employee Type</Form.Label>
                <Form.Select
                  name="employeeType"
                  value={employeeData.employeeType}
                  onChange={handleInputChange}
                >
                  <option value="FullTime">Full-Time</option>
                  <option value="PartTime">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Seasonal">Seasonal</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button type="submit" variant="primary" size="lg">
              Create Employee
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default EmployeeCreate;
