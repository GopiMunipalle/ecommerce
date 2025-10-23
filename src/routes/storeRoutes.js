const {Router}=require("express")
const { authMiddleware } = require("../middlewares/authMiddleware")
const storeController=require("../controllers/storeController")
const validate = require("../middlewares/validateMiddleware")
const storeSchema = require("../validatoions/storeValidation")

const route=Router()

route.post("/",validate(storeSchema),authMiddleware(["admin"]),storeController.createStore)
route.get("/",authMiddleware(["admin"]),storeController.getAllstores)
route.get("/:id",authMiddleware(["admin","customer"]),storeController.getStoreById)

module.exports=route

