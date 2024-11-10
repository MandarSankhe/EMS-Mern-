import React, { useState, useEffect } from 'react';
import EmployeeSearch from './EmployeeSearch';
import EmployeeTable from './EmployeeTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Employee Management System</h1>
      <EmployeeSearch setEmployees={setEmployees} />
      <EmployeeTable employees={employees} />
    </div>
  );
};

export default EmployeeDirectory;
