# Healthcare Portal

A web application for healthcare patients to upload test results and view respiratory masks from Fisher & Paykel Healthcare and other masks as well.

## Features

- User authentication (login/register)
- Test result upload and management
- View Fisher & Paykel respiratory masks
- Other masks page to 
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- Sql workbench
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-portal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create an `uploads` directory in the backend folder:
```bash
cd ../backend
mkdir uploads
```

## Running the Application

1. open SQL workbench
port set to 4000

2. Start the backend server:
```bash
cd backend
npm start
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/healthcare_portal
JWT_SECRET=your-secret-key
PORT=5000
```

## Technologies Used

- Frontend:
  - React
  - React Router
  - CSS3

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - Multer (File Upload)