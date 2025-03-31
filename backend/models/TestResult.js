const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const TestResult = sequelize.define('TestResult', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed'),
        defaultValue: 'pending'
    },
    doctorResponse: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    createdAt: 'upload_date',
    updatedAt: 'updated_at'
});

// Define associations
TestResult.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(TestResult, {
    foreignKey: 'userId',
    as: 'testResults'
});

module.exports = TestResult; 