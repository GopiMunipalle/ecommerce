const { sendError,sendSuccess } = require("../utils/response")
const {cartModel,cartProductModel,userModel,productModel}=require("../models/index")


async function addProductToCart(req, res) {
  try {
    const { productId, isAdded } = req.body;
    const { action } = req.query;
    const cartId = req.user.cartId;

    const productDoc = await productModel.findByPk(productId)

    if (!productDoc) return sendError(res, 404, { error: "Product not found" });

    const cart = await cartProductModel.findOne({
      where: { cartId: cartId, productId },
    });

    if (!isAdded) {
      if (cart) {
        await cart.destroy();
        return sendSuccess(res, "Product successfully removed from cart");
      }
    }

    if (!cart) {
      const newCart = await cartProductModel.create({
        cartId: cartId,
        productId: productId,
        quantity: 1,
        price: productDoc.price,
      });

      return sendSuccess(res, {message:"Product Added To Cart Successfully",newCart});
    }

    if (action === "increase") {
      cart.quantity += 1;
      await cart.save();
      return sendSuccess(res, {message:"Product Added To Cart Successfully",cart});
    } else if (action === "decrease") {
      if (cart.quantity > 1) {
        cart.quantity -= 1;
        await cart.save();
        return res.status(200).json({ data: { cart } });
      } else {
        await cart.destroy();
        return sendSuccess(res, "Product successfully removed from cart");
      }
    }
    sendError(res, 400, { error: "Invalid action or parameters"});
  } catch (error) {
    console.error(error);
    return sendError(res, 500, { error: error.message || "Internal server error" });
  }
}


module.exports={
  addProductToCart}