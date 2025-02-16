const User = require('../models/user');
const Employee = require('../models/emp');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const resolvers = {
  Query: {
    async login(_, { username, email, password }) {
      try {
        // Find user by username or email
        const user = await User.findOne({
          $or: [{ username }, { email }]
        });

        if (!user) {
          throw new UserInputError('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new AuthenticationError('Invalid credentials');
        }

        const token = generateToken(user);

        return {
          token,
          user
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getAllEmployees(_, __, context) {

      try {
        const employees = await Employee.find().sort({ created_at: -1 });
        return employees;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getEmployeeById(_, { id }, context) { 
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        return employee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getEmployeesByFilter(_, { designation, department }, context) {
      
      try {
        const filter = {};
        
        if (designation) {
          filter.designation = designation;
        }
        
        if (department) {
          filter.department = department;
        }
        
        if (!designation && !department) {
          throw new UserInputError('Either designation or department must be provided');
        }
        
        const employees = await Employee.find(filter);
        return employees;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  Mutation: {
    async signup(_, { username, email, password }) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }]
        });

        if (existingUser) {
          throw new UserInputError('Username or email already taken');
        }

        const newUser = new User({
          username,
          email,
          password
        });

        const savedUser = await newUser.save();
        
        const token = generateToken(savedUser);

        return {
          token,
          user: savedUser
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async addEmployee(_, args, context) {
    
      try {
        const existingEmployee = await Employee.findOne({ email: args.email });
        if (existingEmployee) {
          throw new UserInputError('Employee with this email already exists');
        }
        
        const newEmployee = new Employee({
          ...args,
          date_of_joining: new Date(args.date_of_joining)
        });
        
        const savedEmployee = await newEmployee.save();
        return savedEmployee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async updateEmployee(_, { id, ...updates }, context) {
      
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        
        if (updates.email && updates.email !== employee.email) {
          const existingEmail = await Employee.findOne({ email: updates.email });
          if (existingEmail) {
            throw new UserInputError('Email already in use by another employee');
          }
        }
        
        if (updates.date_of_joining) {
          updates.date_of_joining = new Date(updates.date_of_joining);
        }
        
        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        );
        
        return updatedEmployee;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async deleteEmployee(_, { id }, context) {
    
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        
        await Employee.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
};

module.exports = resolvers;