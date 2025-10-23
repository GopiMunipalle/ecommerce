const {Router}=require("express")
const brandController=require("../controllers/brandController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const {brandSchema} = require("../validatoions/brandValidation")
const validate = require("../middlewares/validateMiddleware")
const route=Router() 

route.post("/",validate(brandSchema),authMiddleware(["admin"]),brandController.createBrand)
route.get("/",authMiddleware(["admin"]),brandController.getAllBrands)
route.get("/:id",authMiddleware(["admin"]),brandController.getBrandById)

module.exports=route