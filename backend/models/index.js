"use strict";
const sequelize = require("../config/database");
const User = require("./user");
const TestResult = require("./testResult");
const Mask = require("./mask");

async function init() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Define associations
    TestResult.belongsTo(User, {
      foreignKey: "userId",
    });

    User.hasMany(TestResult, {
      foreignKey: "userId",
    });

    // Ensure Mask model is synced
    await Mask.sync();
    
  } catch (error) {
    console.error('Error initializing models:', error);
  }
}

init();

module.exports = {
  sequelize,
  User,
  TestResult,
  Mask
};
