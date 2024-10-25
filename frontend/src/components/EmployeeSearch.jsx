import React, { useState } from 'react';

function EmployeeSearch() {
  const [searchParams, setSearchParams] = useState({});

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  return (
    <div className="text-center">
      <h2>Search Employees</h2>
      <input type="text" name="name" placeholder="Search by name" onChange={handleInputChange} />
      {
        
      }
    </div>
  );
}

export default EmployeeSearch;
