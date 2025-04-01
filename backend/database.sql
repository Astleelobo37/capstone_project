-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS healthcare_portal;

-- Use the database
USE healthcare_portal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    emailId VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    NHI VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    test_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result VARCHAR(255) NOT NULL,
    notes TEXT,
    clinical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- Create masks table
CREATE TABLE IF NOT EXISTS masks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mask_type VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    serial_number VARCHAR(255) NOT NULL UNIQUE,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    test_result_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (test_result_id) REFERENCES test_results(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
); 