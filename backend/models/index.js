const sequelize = require('../config/database');
const User = require('./User');
const TestResult = require('./TestResult');
const RespiratoryMask = require('./RespiratoryMask');

// Define associations
TestResult.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(TestResult, {
    foreignKey: 'userId',
    as: 'testResults'
});

module.exports = {
    sequelize,
    User,
    TestResult,
    RespiratoryMask
}; 