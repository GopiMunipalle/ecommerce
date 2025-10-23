const {Router}=require("express")
const usercontroller=require("../controllers/userController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validateMiddleware")
const userRegisterAndLoginSchema = require("../validatoions/userValidation")

const route=Router()

route.post("/signup",validate(userRegisterAndLoginSchema),usercontroller.signUpOrCreateUser)
route.post("/login",validate(userRegisterAndLoginSchema),usercontroller.login)
route.get('/customers',authMiddleware(['admin']),usercontroller.findAllUsers)

module.exports=route
