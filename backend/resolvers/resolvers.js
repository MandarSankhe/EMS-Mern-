
const { EmployeeModel } = require('../models/Employee'); // Path to your model
const moment = require('moment');

const resolvers = {
  Query: {
    employees: async (_, { type }) => {
      try {
        const filter = type ? { employeeType: type } : {};
        return await EmployeeModel.find(filter);
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw new Error('Failed to fetch employees');
      }
    },
    employee: async (_, { id }) => {
      try {
        return await EmployeeModel.findById(id);
      } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw new Error('Failed to fetch employee');
      }
    },
    employeesRetiring: async (_, { withinMonths = 6, employeeType }) => {
      console.log('test', { employeeType });
      try {
        const today = moment();
        const retirementThreshold = today.clone().add(withinMonths, 'months');
    
        // Build query criteria for active employees
        const criteria = { currentStatus: true }; 
        if (employeeType !== 'All') {
          criteria.employeeType = employeeType; 
        }
    
        // Fetch employees from the database
        const employees = await EmployeeModel.find(criteria);
    
        // Filter employees retiring within the threshold
        const retiringEmployees = employees.filter((employee) => {
          if (!employee.dateOfBirth) {
            console.warn('Employee missing dateOfBirth:', employee);
            return false; // Skip employees without a valid dateOfBirth
          }
    
          const birthDate = moment(employee.dateOfBirth);
          if (!birthDate.isValid()) {
            console.warn('Invalid dateOfBirth for employee:', employee);
            return false; // Skip employees with invalid dateOfBirth
          }
    
          const retirementDate = birthDate.clone().add(65, 'years'); // Retirement at age 65
    
          // Check if retirementDate falls within the range
          return retirementDate.isBetween(today, retirementThreshold, null, '[)');
        });
    
        // Map and format the filtered employees
        return retiringEmployees.map((employee) => {
          const birthDate = moment(employee.dateOfBirth);
          const retirementDate = birthDate.clone().add(65, 'years');
    
          return {
            id: employee._id.toString(),
            ...employee.toObject(),
            retirementDate: retirementDate.format('YYYY-MM-DD'), // Format retirement date
            monthsUntilRetirement: moment
              .duration(retirementDate.diff(today))
              .asMonths()
              .toFixed(1), // Calculate months until retirement
          };
        });
      } catch (error) {
        console.error('Error fetching employees for upcoming retirement:', error);
        throw new Error('Failed to fetch employees for upcoming retirement');
      }
    }
  },
  Mutation: {
    createEmployee: async (_, { input }) => {
      try {
        const newEmployee = new EmployeeModel({
          ...input,
          currentStatus: true, // Default value for currentStatus
        });
        await newEmployee.save();
        return newEmployee;
      } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Failed to create employee');
      }
    },
    updateEmployee: async (_, { id, input }) => {
      const updates = {};
      if (input.title) updates.title = input.title;
      if (input.department) updates.department = input.department;
      if (typeof input.currentStatus === 'boolean') updates.currentStatus = input.currentStatus;
      return await EmployeeModel.findByIdAndUpdate(id, updates, { new: true });
    },
    deleteEmployee: async (_, { id }) => {
      console.log("Delete Employee Resolver Triggered for ID:", id);
      try {
        // Fetch the employee by ID
        const employee = await EmployeeModel.findById(id);
    
        // Check if the employee exists
        if (!employee) {
          console.warn("Employee not found for ID:", id);
          return { message: "Employee not found" };
        }
    
        // Check the CurrentStatus
        if (employee.currentStatus) { // Ensure field matches your model
          console.warn("Cannot delete active employee:", employee);
          return { message: "CAN’T DELETE EMPLOYEE – STATUS ACTIVE" };
        }
    
        // Proceed to delete the employee
        await EmployeeModel.findByIdAndDelete(id);
        console.log("Employee deleted successfully:", id);
    
        return { message: "Employee deleted successfully" };
      } catch (error) {
        console.error("Error while deleting employee:", error);
        throw new Error("An error occurred while deleting the employee");
      }
    }
    
    
  },
};

module.exports = resolvers;
