-- Create the database
CREATE DATABASE IF NOT EXISTS healthcare_portal;
USE healthcare_portal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed') DEFAULT 'pending',
    doctor_response TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create respiratory_masks table
CREATE TABLE IF NOT EXISTS respiratory_masks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample respiratory masks
INSERT INTO respiratory_masks (name, description, price, image_path) VALUES
('Fisher & Paykel Vitera Full Face Mask', 'Premium full face mask with advanced seal technology', 199.99, '/images/vitera-mask.jpg'),
('Fisher & Paykel Simplus Full Face Mask', 'Comfortable and easy-to-use full face mask', 179.99, '/images/simplus-mask.jpg'),
('Fisher & Paykel Eson 2 Nasal Mask', 'Lightweight nasal mask with minimal contact points', 149.99, '/images/eson-mask.jpg'); 