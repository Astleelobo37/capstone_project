const fs = require('fs');
const path = require('path');
const { sequelize, User, TestResult, Mask } = require('../models');

async function initializeDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Load and parse JSON data
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/users.json'), 'utf8')
    );
    const testResultsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/testResults.json'), 'utf8')
    );
    const masksData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/masks.json'), 'utf8')
    );

    // Transform user data
    const transformedUsers = usersData.map(user => ({
      email: user.email,
      password: user.password,
      name: `${user.firstName} ${user.lastName}`,
      role: 'patient',
      NHI: user.NHI,
      DOB: user.DOB,
      address: user.address
    }));

    // Transform test results data
    const transformedTestResults = testResultsData.map(result => ({
      userId: result.userid,
      testDate: result.test_date,
      result: result.result,
      status: result.status,
      clinicalNotes: result.clinical_notes
    }));

    // Transform masks data
    const transformedMasks = masksData.map(mask => ({
      maskType: mask.mask_type,
      stock: mask.stock,
      serialNumber: mask.serial_number,
      orderDate: mask.order_date,
      description: mask.description,
      price: mask.price
    }));

    // Create users with update on duplicate
    await User.bulkCreate(transformedUsers, {
      updateOnDuplicate: ['password', 'name', 'role', 'NHI', 'DOB', 'address']
    });
    console.log('Users created/updated successfully');

    // Create test results with update on duplicate
    await TestResult.bulkCreate(transformedTestResults, {
      updateOnDuplicate: ['result', 'status', 'clinicalNotes']
    });
    console.log('Test results created/updated successfully');

    // Create masks with update on duplicate
    await Mask.bulkCreate(transformedMasks, {
      updateOnDuplicate: ['stock', 'description', 'price']
    });
    console.log('Masks created/updated successfully');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }); 