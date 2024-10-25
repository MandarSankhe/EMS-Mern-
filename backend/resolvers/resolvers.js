// Ensure you are importing your EmployeeModel correctly
const { EmployeeModel } = require('../models/Employee'); // Path to your model

const resolvers = {
  Query: {
    employees: async () => {
      try {
        // Fetch employees from the database
        const employees = await EmployeeModel.find();
        return employees;
      } catch (error) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees");
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
        console.error("Error creating employee:", error);
        throw new Error("Failed to create employee");
      }
    },
  },
};

module.exports = resolvers;
