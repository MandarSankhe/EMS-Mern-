const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  employeeType: { type: String, required: true },
  currentStatus: { type: Boolean, default: true },
  dateOfBirth: { type: String, required: true },
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = { EmployeeModel };
