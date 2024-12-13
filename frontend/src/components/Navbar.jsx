import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => (
  <BootstrapNavbar bg="light" expand="lg">
    <Container>
      {/* Navbar Brand - Name of Company */}
      <BootstrapNavbar.Brand as={Link} to="/">
        <img src="../ems_logo.png" alt="Company Logo" className="custom-logo"/>
      </BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
      <BootstrapNavbar.Collapse id="navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/" className='nav-link-custom'>
            <img src="../home-icon-black.png" alt="Home icon" className="nav-logo"/>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/create" className='nav-link-custom'>
            <img src="../add-icon-black.png" alt="add icon" className="nav-logo"/>
            Add Employee
          </Nav.Link>
          <Nav.Link as={Link} to="/upcoming-retirement" className='nav-link-custom'>
            <img src="../upcoming-retirement-logo.png" alt="upcoming icon" className="nav-logo"/>
            Upcoming Retirement
          </Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </Container>
  </BootstrapNavbar>
);

export default Navbar;
