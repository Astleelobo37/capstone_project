const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();
require("dotenv").config();
let dbConnect = require("./dbConnect");

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Healthcare Portal API." });
});

let userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

let maskRoutes = require('./routes/maskRoutes');
app.use('/api/masks', maskRoutes);

let testResultRoutes = require('./routes/testResultRoutes');
app.use('/api/test-results', testResultRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.error('Error starting server:', err);
    }
});
