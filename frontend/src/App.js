import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmployeeDetails from './components/EmployeeDetails';
import EmployeeCreate from './components/EmployeeCreate';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeeDirectory />} />
        <Route path="/create" element={<EmployeeCreate />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
