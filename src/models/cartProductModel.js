const { DataTypes } = require("sequelize")
const {sequelize}=require("../config/dbConfig")

const cartProductModel = sequelize.define("cartProduct", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: { 
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, { tableName: "cart_products", timestamps: true });


module.exports=cartProductModel