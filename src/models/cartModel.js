const { DataTypes } = require("sequelize")
const {sequelize}=require("../config/dbConfig")

const cartModel=sequelize.define("cart",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    cartPrice:{
        type:DataTypes.FLOAT,
        defaultValue:0
    }
},{tableName:"carts",timestamps:true})



module.exports=cartModel