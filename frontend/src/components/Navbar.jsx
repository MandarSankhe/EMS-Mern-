import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => (
  <BootstrapNavbar bg="light" expand="lg">
    <Container>
      {/* Navbar Brand - Name of Company */}
      <BootstrapNavbar.Brand as={Link} to="/">
        Employee Management
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
      <BootstrapNavbar.Collapse id="navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/create">
            Add Employee
          </Nav.Link>
          <Nav.Link as={Link} to="/upcoming-retirement">
            Upcoming Retirement
          </Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </Container>
  </BootstrapNavbar>
);

export default Navbar;
