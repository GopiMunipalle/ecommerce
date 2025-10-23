const {sequelize}=require("../config/dbConfig")
const {DataTypes}=require("sequelize")

const orderModel=sequelize.define("Order",{
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        autoIncrement:true,
        primaryKey:true
    },
    // customerId:{
    //     type:DataTypes.INTEGER,
    //     allowNull:true
    // },
    // userId:{
    //     type:DataTypes.INTEGER,
    //     allowNull:true
    // },
    storeId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    totalAmount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('CREATED', 'PAYMENT_PENDING', 'PAID', 'FAILED', 'CANCELLED','SUCCESS'),
        allowNull:false,
        defaultValue:"CREATED"
    },
    addressId:{
        type:DataTypes.BIGINT.UNSIGNED,
        allowNull:false
    },
    orderType:{
        type:DataTypes.ENUM('CART', 'NORMAL'),
        allowNull:false
    },
    rzpOrderId:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:null
    },
    paymentMode:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:null
    }
},{tableName:"orders",timestamps:true})

const orderProductModel=sequelize.define("orderProducts",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    orderId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{tableName:"order_products",timestamps:false})

module.exports={orderModel,orderProductModel}