const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const userModel = require("./userModel");
const productCatagoryModel=require("./productCategoryModel");
const productModel = require("./productModel");

const categoryModel = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    createdBy:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  },
  { tableName: "categories", timestamps: true }
);

// categoryModel.belongsTo(userModel, {
//   foreignKey: "createdBy",
//   as: "createdByUser",
// });

// productModel.belongsToMany(categoryModel, {
//   through: productCatagoryModel,
//   foreignKey: "productId",
//   as: "categories",
// });

// categoryModel.belongsToMany(productModel, {
//   through: productCatagoryModel,
//   foreignKey: "categoryId",
//   as: "products",
// });

module.exports = categoryModel;
