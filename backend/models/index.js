"use strict";
const sequelize = require("../config/database");
const User = require("./user");
const TestResult = require("./testResult");
const Mask = require("./mask");
//const RespiratoryMaskType = require('./RespiratoryMaskType');

async function init() {
  await User.sync();
  await Mask.sync();
  await TestResult.sync();

  // Define associations
  TestResult.belongsTo(User, {
    foreignKey: "userid",
  });

  User.hasMany(TestResult, {
    foreignKey: "userid",
  });

  // Add associations for Mask

  TestResult.belongsTo(Mask, {
    foreignKey: "maskid",
  });

  Mask.hasMany(TestResult, {
    foreignKey: "maskid",
  });
}

init();
module.exports = {
  sequelize,
  User,
  TestResult,
  Mask,
};
