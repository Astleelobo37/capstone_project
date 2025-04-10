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
```

## Technologies Used

Frontend Dependencies (from package.json):
React
React Router DOM
Material-UI (MUI)
Axios
React Context API
Vite (build tool)

Backend Dependencies:
Express.js
MySQL
Sequelize ORM
JWT (JSON Web Tokens)
Bcrypt
CORS
Dotenv

Database:
MySQL
UI Components (Material-UI):
Box
Container
Grid
Card
CardMedia
CardContent
CardActions
Typography
Button
TextField
Snackbar
Alert
CircularProgress
Paper
AppBar
Toolbar
IconButton
Badge
Divider
List
ListItem
ListItemText
ListItemSecondaryAction
Chip

Icons (Material-UI Icons):
ShoppingCart
Person
Logout


Context Providers:
AuthContext (for authentication)
CartContext (for shopping cart)
MaskContext (for mask data)
API Endpoints:
Authentication (login/register)
Masks CRUD operations
Cart operations
User management

Development Tools:
Visual Studio Code
MySQL Workbench
Postman (for API testing)
Git (for version control)

Styling:
Material-UI styling system
CSS-in-JS (styled-components)
Custom theme configuration
Security Features:
JWT authentication
Password hashing
Protected routes
CORS configuration
Environment variables
