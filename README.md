# Customer Management Application

A full-stack Customer Management Application for managing client leads generated from website contact forms.

## Tech Stack

**Frontend:** React.js (Vite), Tailwind CSS v4, React Router, Axios, Chart.js, Framer Motion
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcryptjs

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas connection string)

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd "d:\VS code\futureintern\02"
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   - Ensure the `.env` file in `/server` is correctly configured:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/mini-crm
     JWT_SECRET=supersecretjwtkey123
     NODE_ENV=development
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## Features

- **Authentication:** JWT-based secure login.
- **Dashboard:** Interactive charts and statistics for customer management.
- **Customers Listing:** View, search, filter, and delete customers.
- **Customer Details:** Change customer status and add internal notes and payment history.
- **Add Customer:** Manually input new customers into the management system.
- **Public API:** Endpoint `/api/public/contact` available for integration with your website's public contact form.

## Creating an Admin User

Currently, there is no public registration page for admins. You can create an admin user by sending a `POST` request to `http://localhost:5000/api/auth/register` using Postman or Thunder Client with the following JSON body:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

After creation, you can log in through the frontend UI.
