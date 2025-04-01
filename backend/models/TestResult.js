const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");
const sequelizeInstance = dbConnect.Sequelize;
const User = require('./user');

class TestResult extends Model {}

// Sequelize will create this table if it doesn't exist on startup
TestResult.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    test_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    clinical_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    maskid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'masks',
          key: 'id'
        }
      },
    }
,
  {
    sequelize: sequelizeInstance,
    modelName: "test_results", // use lowercase plural format
    timestamps: true,
    freezeTableName: true,
  }
);


module.exports = TestResult; 