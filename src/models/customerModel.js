const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const cartModel = require("./cartModel");

const customerModel = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "CUSTOMER",
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "customers",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

// customerModel.hasOne(cartModel, {
//   foreignKey: "customerId",
//   as: "cart",
// });

// cartModel.belongsTo(customerModel, {
//   foreignKey: "customerId",
//   as: "customer",
// });

module.exports = customerModel;
