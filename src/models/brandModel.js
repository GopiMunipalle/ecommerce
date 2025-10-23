const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const userModel = require("./userModel");

const brandModel = sequelize.define(
  "Brand",
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
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  { tableName: "brands", timestamps: true }
);

// brandModel.belongsTo(userModel, {
//   foreignKey: "createdBy",
//   as: "createdByUser",
// });


module.exports = brandModel;
