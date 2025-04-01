const Models = require("../models");
const fs = require('fs');
const path = require('path');

async function initialiseDatabase() {
    try {
        console.log("Starting database initialization...");
        // Check if we already have data
        const userCount = await Models.User.count();
        const testResultCount = await Models.TestResult.count();

        console.log(`Current counts - Users: ${userCount}, Test Results: ${testResultCount}`);

        if (userCount === 0 && testResultCount === 0) {
            console.log("Database is empty, starting population...");
            await populateDatabase();
            console.log("Data fetched and populated successfully");
        } else {
            console.log("Database already populated");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

async function populateDatabase() {
    try {
        // Load and create users
        console.log("Loading users from JSON...");
        const users = await loadUsers();
        console.log(`Found ${users.length} users to add`);
        for (const user of users) {
            await Models.User.create(user);
        }
        console.log(`Added ${users.length} users`);

        // Load and create test results
        console.log("Loading test results from JSON...");
        const testResults = await loadTestResults();
        console.log(`Found ${testResults.length} test results to add`);
        for (const result of testResults) {
            await Models.TestResult.create(result);
        }
        console.log(`Added ${testResults.length} test results`);

    } catch (error) {
        console.error("Error populating database:", error);
        throw error;
    }
}

async function loadUsers() {
    try {
        const filePath = path.join(__dirname, '../../data/users.json');
        console.log(`Attempting to read users from: ${filePath}`);
        const usersData = JSON.parse(
            fs.readFileSync(filePath, 'utf8')
        );
        console.log(`Successfully read users data: ${JSON.stringify(usersData, null, 2)}`);

        return usersData.map(user => ({
            email: user.email,
            password: user.password, // Note: In production, this should be hashed
            name: `${user.firstName} ${user.lastName}`,
            role: 'patient', // Default role for all users
            NHI: user.NHI,
            DOB: user.DOB,
            address: user.address
        }));
    } catch (error) {
        console.error("Error loading users:", error);
        return [];
    }
}

async function loadTestResults() {
    try {
        const filePath = path.join(__dirname, '../../data/testResults.json');
        console.log(`Attempting to read test results from: ${filePath}`);
        const testResultsData = JSON.parse(
            fs.readFileSync(filePath, 'utf8')
        );
        console.log(`Successfully read test results data: ${JSON.stringify(testResultsData, null, 2)}`);

        return testResultsData.map(result => ({
            userId: result.userid, // Note: converting from userid to userId to match model
            testDate: result.test_date,
            result: result.result,
            status: result.status,
            clinicalNotes: result.clinical_notes
        }));
    } catch (error) {
        console.error("Error loading test results:", error);
        return [];
    }
}

module.exports = initialiseDatabase; 