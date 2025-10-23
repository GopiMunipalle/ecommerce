const express=require("express")
const dotEnv=require("dotenv")
const cors=require("cors")
const {sequelize}=require("./config/dbConfig")
dotEnv.config()
const app=express()
require("./models/index")

const userRoutes=require("./routes/userRoutes")
const customerRoutes=require("./routes/customerRoutes")
const brandRoutes=require("./routes/brandRoutes")
const categoryRoutes=require("./routes/categoryRoutes")
const productRoutes=require("./routes/productRoutes")
const storeRoutes=require("./routes/storeRoutes")
const cartRoutes=require("./routes/cartRoutes")
const orderRoutes=require("./routes/orderRoutes")
const { razorpayWebhook } = require("./controllers/paymentController");

app.use(cors({origin:"*"}))
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}))
app.use(express.urlencoded({extended:true}))

const v1Router = express.Router();
const router = express.Router();
app.use(router);
router.post("/api/v1/payments/webhook", express.json({ type: "*/*" }), razorpayWebhook);

v1Router.use("/admin", userRoutes);
v1Router.use("/customer", customerRoutes);
v1Router.use("/brand", brandRoutes);
v1Router.use("/category", categoryRoutes);
v1Router.use("/product",productRoutes)
v1Router.use("/store", storeRoutes);
v1Router.use("/cart", cartRoutes);
v1Router.use("/order", orderRoutes);

app.use('/api/v1', v1Router);




async function startServer(){
    try {
        await sequelize.sync({sync:true})
        app.listen(process.env.PORT,()=>{
          console.log(`Server is running at port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log('error',error)
        process.exit()
    }
}

startServer()
