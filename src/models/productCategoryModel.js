const {sequelize}=require('../config/dbConfig')
const {DataTypes}=require('sequelize')

const productCatagoryModel=sequelize.define('ProductCategory', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    // productId:{
    //     type:DataTypes.INTEGER.UNSIGNED,
    //     allowNull:false
    // },
    // categoryId:{
    //     type:DataTypes.INTEGER.UNSIGNED,
    //     allowNull:false
    // }
},{tableName:"product_categories",timestamps:true})

module.exports=productCatagoryModel