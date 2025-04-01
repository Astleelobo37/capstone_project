const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');
const { User, TestResult, Mask } = require('../models');

const dataPath = path.join(__dirname, '../../data');

async function populateDatabase() {
    try {
        // Read JSON files
        const usersData = JSON.parse(fs.readFileSync(path.join(dataPath, 'users.json'), 'utf8'));
        const testResultsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'testResults.json'), 'utf8'));
        const masksData = JSON.parse(fs.readFileSync(path.join(dataPath, 'masks.json'), 'utf8'));

        // Transform users data to match the model
        const transformedUsersData = usersData.map(({ id, firstName, lastName, ...rest }) => ({
            ...rest,
            name: `${firstName} ${lastName}`,
            role: 'patient' // Set default role
        }));

        // Force sync to recreate tables
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');

        // Insert users first
        const users = await User.bulkCreate(transformedUsersData, {
            returning: true,
            individualHooks: true,
            updateOnDuplicate: ['name', 'password', 'role', 'NHI', 'DOB', 'address', 'updated_at']
        });
        console.log(`${users.length} users created successfully`);

        // Get the list of valid user IDs
        const validUserIds = users.map(user => user.id);

        // Transform test results data to ensure userId references exist and filter for valid users
        const transformedTestResults = testResultsData
            .filter(result => validUserIds.includes(result.userid))
            .map(({ id, userid, test_date, ...rest }) => ({
                ...rest,
                userId: userid,
                testDate: test_date
            }));

        // Insert test results
        const testResults = await TestResult.bulkCreate(transformedTestResults, {
            returning: true,
            individualHooks: true,
            updateOnDuplicate: ['result', 'status', 'clinical_notes', 'updated_at']
        });
        console.log(`${testResults.length} test results created successfully`);

        // Transform mask data to match the model
        const transformedMasks = masksData.map(({ mask_type, serial_number, order_date, ...rest }) => ({
            ...rest,
            maskType: mask_type,
            serialNumber: serial_number,
            orderDate: order_date
        }));

        // Insert masks
        const masks = await Mask.bulkCreate(transformedMasks, {
            returning: true,
            individualHooks: true,
            updateOnDuplicate: ['stock', 'price', 'description', 'updated_at']
        });
        console.log(`${masks.length} masks created successfully`);

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
        // Log more details about the error
        if (error.parent) {
            console.error('SQL Error:', error.parent.sqlMessage);
            console.error('SQL State:', error.parent.sqlState);
        }
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the population script
populateDatabase(); 