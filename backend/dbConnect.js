"use strict";
const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

// Function to create database if it doesn't exist
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Initialize database and connection
const initializeDatabase = async () => {
  try {
    // First create the database
    await createDatabase();

    // Test the connection
    await sequelize.authenticate();
    console.log(`Successful connection to MySQL Database ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("Unable to connect to MySQL database:", error);
    process.exit(1);
  }
};

// Initialize database
initializeDatabase();

module.exports = {
  Sequelize: sequelize
};
