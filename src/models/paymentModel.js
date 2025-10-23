const {sequelize}=require("../config/dbConfig")
const {DataTypes}=require('sequelize')

const paymentModel=sequelize.define("payment",{
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        primaryKey:true
    },
    rzpPaymentId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    orderId:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    rzpOrderId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    paymentMode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{tableName:"payments",timestamps:true})

module.exports=paymentModel