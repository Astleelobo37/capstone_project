const { DataTypes, Model } = require("sequelize");
let dbConnect = require("../dbConnect");
const sequelizeInstance = dbConnect.Sequelize;

class Mask extends Model {}

// Sequelize will create this table if it doesn't exist on startup
Mask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    mask_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    test_result_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'test_results',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize: sequelizeInstance,
    modelName: "masks", // use lowercase plural format
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Mask; 
module.exports = Mask; 