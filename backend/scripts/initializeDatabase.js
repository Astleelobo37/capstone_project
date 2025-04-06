const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const { User, TestResult, Mask } = require('../models');
const bcrypt = require('bcryptjs');

const initializeDatabase = async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Load JSON data
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));
    const testResultsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/testResults.json'), 'utf8'));
    const masksData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/masks.json'), 'utf8'));

    // Hash passwords for users
    const usersWithHashedPasswords = await Promise.all(usersData.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt); // Using a default password for all users
      return {
        ...user,
        password: hashedPassword
      };
    }));

    // Create users
    await User.bulkCreate(usersWithHashedPasswords, {
      updateOnDuplicate: ['password', 'firstName', 'lastName', 'role', 'NHI', 'DOB', 'address']
    });
    console.log('Users created successfully');

    // Create test results
    await TestResult.bulkCreate(testResultsData, {
      updateOnDuplicate: ['result', 'status', 'clinicalNotes']
    });
    console.log('Test results created successfully');

    // Create masks
    await Mask.bulkCreate(masksData, {
      updateOnDuplicate: ['stock', 'description', 'price']
    });
    console.log('Masks created successfully');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
};

initializeDatabase(); 