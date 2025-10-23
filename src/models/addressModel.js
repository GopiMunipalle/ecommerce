const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const customerModel = require("./customerModel");

const addressModel = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    line1: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
  },
  { tableName: "addresses", timestamps: true }
);

// customerModel.hasMany(addressModel, {
//   foreignKey: "customerId",
//   as: "addresses",
// });

// addressModel.belongsTo(customerModel, {
//   foreignKey: "customerId",
//   as: "customer",
// });

module.exports = addressModel;
