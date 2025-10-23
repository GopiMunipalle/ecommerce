const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const addressModel = require("./addressModel");
const productModel = require("./productModel");

const storeModel = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { tableName: "stores", timestamps: true }
);

// storeModel.hasMany(productModel, {
//   foreignKey: "productId",
//   as: "products",
// });

// storeModel.hasOne(addressModel, {
//   foreignKey: "storeId",
//   as: "address",
// });

// addressModel.belongsTo(storeModel, {
//   foreignKey: "storeId",
//   as: "store",
// });

module.exports = storeModel;
