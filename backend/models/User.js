const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect').sequelize;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('patient', 'doctor', 'admin'),
        defaultValue: 'patient'
    },
    NHI: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    DOB: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User; 