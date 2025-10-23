const {Router}=require("express")
const customerController=require("../controllers/customerController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validateMiddleware")
const userRegisterAndLoginSchema = require("../validatoions/userValidation")
const addressValidation = require("../validatoions/addressValidation")

const route=Router()

route.post('/',validate(userRegisterAndLoginSchema),customerController.userRegister)
route.post('/login',validate(userRegisterAndLoginSchema),customerController.userLogin)
route.get('/profile',authMiddleware(['customer']),customerController.getUserProfile)
route.put('/address',validate(addressValidation),authMiddleware(['customer']),customerController.updateUserAddress)

module.exports=route