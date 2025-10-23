const {Router}=require("express")
const multer=require("multer")
const productController=require("../controllers/productController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const validate = require("../middlewares/validateMiddleware")
const productSchema = require("../validatoions/productValidation")
const route=Router()
const upload = multer({
    // limits: {
    //     fileSize: 10 * 1024 * 1024
    // },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
        }
        cb(null, true);
    }
});


route.post("/",validate(productSchema),upload.array("images"),authMiddleware(["admin"]),productController.createProduct)
route.get("/",authMiddleware(["admin","customer"]),productController.getAllProducts)
route.get("/:id",authMiddleware(["admin","customer"]),productController.getProductById)

module.exports=route