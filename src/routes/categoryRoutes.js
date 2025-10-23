const {Router}=require("express")
const route=Router()

const categoryController=require("../controllers/categoryController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validateMiddleware")
const { categorySchema } = require("../validatoions/categoryValidation")

route.post("/",validate(categorySchema),authMiddleware(["admin"]),categoryController.createCategory)
route.get("/",authMiddleware(["admin"]),categoryController.getAllCategories)
route.get("/:id",authMiddleware(["admin"]),categoryController.getCategoryById)
route.get("/products/:id",authMiddleware(["admin"]),categoryController.findAllProductsByCategoryId)

module.exports=route