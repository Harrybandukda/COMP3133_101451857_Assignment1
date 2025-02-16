# COMP 3133 - Assignment 1 - Full Stack Development II

**Student Name**: Mo Harry Bandukda  
**Student ID**: 101451857

🚀 Project Overview
This project is a **GraphQL-based Backend Application** for an Employee Management System, built with **Node.js**, **Express**, and **MongoDB**. The application implements user authentication and provides comprehensive CRUD operations for employee management through a GraphQL API.

📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

🛠️ Quick Start Guide
Step 1: Clone the repository
Clone this repository to your local machine:

```
git clone https://github.com/Harrybandukda/COMP3133_101451857_Assignment1.git
cd COMP3133_101451857_Assignment1
```

Step 2: Install dependencies
Install all required packages:

```
npm install
```

Step 3: Set up environment variables
Create a `.env` file in the root directory with the following:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/comp3133_101451857_assignment1
JWT_SECRET=your_jwt_secret_key
```

Step 4: Start the server
Run the application:

```
npm run dev
```

Step 5: Access GraphQL playground
Once the server is running, you can access the GraphQL playground at:

```
http://localhost:4000/graphql
```

🔍 GraphQL Operations

### User Operations
- Mutation: `signup` - Create new user account
- Query: `login` - Authenticate and get access token

### Employee Operations
- Query: `getAllEmployees` - Retrieve complete employee list
- Mutation: `addEmployee` - Create new employee record
- Query: `getEmployeeById` - Find employee by ID
- Mutation: `updateEmployee` - Update existing employee
- Mutation: `deleteEmployee` - Remove employee from system
- Query: `getEmployeesByFilter` - Search by designation/department

---

📝 **Created by Mo Harry Bandukda**  