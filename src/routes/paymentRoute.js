const {Router}=require("express")
const paymentConroller=require("../controllers/paymentController")
const route=Router()

route.post("/",paymentConroller.razorpayWebhook)

module.exports=route