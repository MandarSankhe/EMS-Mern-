import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container">
      {/* Navbar Brand - Name of Company */}
      <Link className="navbar-brand" to="/">Employee Management</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create">Add Employee</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/upcoming-retirement">Upcoming Retirement</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
