import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container">
      <Link className="navbar-brand" to="/">Employee Management</Link>
      <div>
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/create">Add Employee</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
