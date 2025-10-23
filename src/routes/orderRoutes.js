const {Router}=require("express")
const orderController=require("../controllers/orderController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const route=Router()

route.post("/",authMiddleware(["customer","admin"]),orderController.createCartOrder)
route.post("/placeOrder",authMiddleware(["customer","admin"]),orderController.placeOrder)
// route.get("/",orderController.getAllOrders)
// route.get("/:id",orderController.getOrderById)

module.exports=route