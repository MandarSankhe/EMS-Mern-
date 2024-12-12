
const { EmployeeModel } = require('../models/Employee'); // Path to your model

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
      await EmployeeModel.findByIdAndDelete(id);
      return { message: "Employee deleted successfully" };
    },
  },
};

module.exports = resolvers;
