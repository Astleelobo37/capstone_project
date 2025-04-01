const Models = require("../models");
const fs = require('fs');
const path = require('path');

async function initialiseDatabase() {
    try {
        // Check if we already have data
        const userCount = await Models.User.count();
        const maskCount = await Models.RespiratoryMask.count();
        const testResultCount = await Models.TestResult.count();

        if (userCount === 0 && maskCount === 0 && testResultCount === 0) {
            await populateDatabase();
            console.log("Data fetched and populated successfully");
        } else {
            console.log("Database already populated");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function populateDatabase() {
    try {
        // Load and create users
        const users = await loadUsers();
        for (const user of users) {
            await Models.User.create(user);
        }
        console.log(`Added ${users.length} users`);

        // Load and create respiratory masks
        const masks = await loadMasks();
        for (const mask of masks) {
            await Models.RespiratoryMask.create(mask);
        }
        console.log(`Added ${masks.length} respiratory masks`);

        // Load and create test results
        const testResults = await loadTestResults();
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
        const usersData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../../data/users.json'),
                'utf8'
            )
        );

        return usersData.map(user => ({
            email: user.email,
            password: user.password, // Note: In production, this should be hashed
            name: user.name,
            role: user.role
        }));
    } catch (error) {
        console.error("Error loading users:", error);
        return [];
    }
}

async function loadMasks() {
    try {
        const masksData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../../data/masks.json'),
                'utf8'
            )
        );

        return masksData.map(mask => ({
            name: mask.name,
            description: mask.description,
            price: mask.price,
            imagePath: mask.imagePath
        }));
    } catch (error) {
        console.error("Error loading masks:", error);
        return [];
    }
}

async function loadTestResults() {
    try {
        const testResultsData = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, '../../data/testResults.json'),
                'utf8'
            )
        );

        return testResultsData.map(result => ({
            userId: result.userId,
            filePath: result.filePath,
            status: result.status,
            doctorResponse: result.doctorResponse
        }));
    } catch (error) {
        console.error("Error loading test results:", error);
        return [];
    }
}

module.exports = initialiseDatabase; 