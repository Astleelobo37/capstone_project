const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'healthcare_portal',
    'root',
    'Leonild2137', // Add your MySQL password here
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: console.log, // Enable SQL query logging
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize; 