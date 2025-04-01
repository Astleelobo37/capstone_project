"use strict";
const sequelize = require('../config/database');
const User = require('./User');
const TestResult = require('./TestResult');
const Mask = require('./mask');
const RespiratoryMaskType = require('./RespiratoryMaskType');

async function init() {
    await User.sync();
    await TestResult.sync();
    await Mask.sync();
    await RespiratoryMaskType.sync();
}

init();

// Define associations
TestResult.belongsTo(User, {
    foreignKey: 'userid',
    as: 'user'
});

User.hasMany(TestResult, {
    foreignKey: 'userid',
    as: 'testResults'
});

// Add associations for Mask
Mask.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Mask.belongsTo(TestResult, {
    foreignKey: 'test_result_id',
    as: 'testResult'
});

User.hasMany(Mask, {
    foreignKey: 'user_id',
    as: 'masks'
});

TestResult.hasMany(Mask, {
    foreignKey: 'test_result_id',
    as: 'masks'
});

module.exports = {
    sequelize,
    User,
    TestResult,
    Mask,
    RespiratoryMaskType
}; 