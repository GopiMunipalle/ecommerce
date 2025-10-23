const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const cartModel = require("./cartModel");

const userModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
      defaultValue: "ADMIN",
    },
    cartId:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
  },
  {
    tableName: "users",
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

// userModel.hasOne(cartModel, {
//   foreignKey: "userId",
//   as: "cart",
// });

// cartModel.belongsTo(userModel, {
//   foreignKey: "userId",
//   as: "user",
// });

module.exports = userModel;
