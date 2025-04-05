const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
require("dotenv").config();
let dbConnect = require("./dbConnect");
const initialiseDatabase = require("./init/initialiseDatabase");

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Healthcare Portal API." });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const maskRoutes = require('./routes/maskRoutes');
const testResultRoutes = require('./routes/testResultRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/masks', maskRoutes);
app.use('/api/test-results', testResultRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;

// Initialize database and start server
dbConnect.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  initialiseDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  });
});
