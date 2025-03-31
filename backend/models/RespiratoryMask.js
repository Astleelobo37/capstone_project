const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RespiratoryMask = sequelize.define('RespiratoryMask', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    imagePath: {
        type: DataTypes.STRING,
        field: 'image_path'
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = RespiratoryMask; 