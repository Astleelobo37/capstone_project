const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = '24h';

// Login a user
exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, NHI, password } = req.body;

    if (!email && !(NHI || password)) {
      console.log('No email or NHI provided');
      return res.status(400).json({ message: 'Email & password or NHI & email required' });
    }


    // Find user by either email or NHI
    console.log('Searching for user with:', { email, NHI });
    const user = await User.findOne({
      where: 
     { email },
      });

    if (!user) {
      console.log('No user found');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User found:', user.email);

    // Validate password
    if (password){
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }
  }else if (NHI){
    if (NHI != user.NHI) {
      console.log('Invalid NHI');
      return res.status(401).json({ message: 'Invalid NHI' });
    }
  }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return user (without password) and token
    const userWithoutPassword = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      NHI: user.NHI,
      DOB: user.DOB,
      address: user.address,
      token
    };

    console.log('Login successful for user:', user.email);
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, NHI, DOB, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if NHI is already used
    const existingNHI = await User.findOne({ where: { NHI } });
    if (existingNHI) {
      return res.status(400).json({ message: 'NHI number already registered' });
    }

    // Hash password
    //const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      NHI,
      DOB,
      address,
      role: 'patient' // Default role
    });

    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Return user without password
    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      NHI: newUser.NHI,
      DOB: newUser.DOB,
      address: newUser.address
    };

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, NHI } = req.body;

    // Find user by email and NHI
    const user = await User.findOne({ where: { email, NHI } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would:
    // 1. Generate a password reset token
    // 2. Save it to the database with an expiration
    // 3. Send an email with a link containing the token

    // For this demo, we'll simulate success
    return res.status(200).json({
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    // In a real application, you would:
    // 1. Verify the reset token
    // 2. Check if it's not expired
    // 3. Find the user by email

    // Find user by email (simplified for demo)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Verify JWT token middleware
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 