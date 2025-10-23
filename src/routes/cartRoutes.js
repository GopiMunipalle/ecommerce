const {Router}=require('express')
const cartController=require("../controllers/cartController")
const { authMiddleware } = require('../middlewares/authMiddleware')
const route=Router()

route.post("/",authMiddleware(["customer","admin"]),cartController.addProductToCart)

module.exports=route