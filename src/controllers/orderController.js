const {sequelize}=require("../config/dbConfig")
const {sendSuccess,sendError}=require("../utils/response")
const {userModel,cartModel,orderProductModel,customerModel,orderModel,cartProductModel,productModel}=require("../models/index")
const razorpayClient=require("../config/razorpay")

async function createCartOrder(req, res) {
  const t = await sequelize.transaction();
  const { addressId } = req.body;
  try {
    let user;
    if (req.user.role === "ADMIN") {
      user = await userModel.findOne({ where: { id: req.user.id }, transaction: t });
    } else {
      user = await customerModel.findOne({ where: { id: req.user.id }, transaction: t });
    }

    const cart = await cartModel.findOne({
      where: { 
        ...(req.user.role === "ADMIN" ? { userId: user.id } : { customerId: user.id })
      },
      include: [{
        model: cartProductModel,
        as: "cartProducts",
        include: [
          {
            model: productModel,
            as: "product"
          }
        ]
      }],
      transaction: t
    });

    if (!cart || !cart.cartProducts.length) {
      await t.rollback();
      return sendError(res, 400, { error: "No products found in cart" });
    }

    let totalAmount = 0;
    let totalQuantity = 0;

    for (const cp of cart.cartProducts) {
      totalAmount += cp.price * cp.quantity;
      totalQuantity += cp.quantity;
    }

    const order = await orderModel.create(
      {
        customerId: req.user.role !== "ADMIN" ? user.id : null,
        userId: req.user.role === "ADMIN" ? user.id : null,
        totalAmount,
        discountPrice: 0,
        orderStatus: "CREATED",
        orderType: "CART",
        quantity: totalQuantity,
        addressId
      },
      { transaction: t }
    );

    const productResponse = [];

    for (const cp of cart.cartProducts) {
      await orderProductModel.create({
        orderId: order.id,
        productId: cp.productId,
        quantity: cp.quantity,
        price: cp.price
      }, { transaction: t });

      productResponse.push({
        ...cp.product.toJSON(),
        noOfItems: cp.quantity
      });
    }

    await t.commit();

    return res.json({
      data: {
        order: order.toJSON(),
        productDetails: productResponse
      }
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, 500, { error: err.message || "Something went wrong" });
  }
}

async function placeOrder(req, res) {
  try {
    const { orderId } = req.body;

    const orderDoc = await orderModel.findOne({
      where: { id: orderId },
      include: [
        {
          model: orderProductModel,
          as: "orderProducts",
          include: [
            {
              model: productModel,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!orderDoc) return sendError(res, 400, { error: "Order not found" });

    const options = {
      amount: Math.round(orderDoc.totalAmount * 100),
      currency: "INR",
    };

    const rzpOrder = await razorpayClient.orders.create(options);

    orderDoc.rzpOrderId = rzpOrder.id;
    orderDoc.orderStatus = "PAYMENT_PENDING";
    await orderDoc.save();

    return res.json({
      data: {
        razorpayOrderId: rzpOrder.id,
        orderDetails: orderDoc.toJSON(),
      },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, { error: err.message || "Something went wrong" });
  }
}

async function getOrderDetails(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findOne({
      where: { id: orderId },
      include: [
        {
          model: orderProductModel,
          as: "orderProducts",
          include: [
            {
              model: productModel,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!order) return sendError(res, 404, { error: "Order not found" });

    const productDetails = order.orderProducts.map((op) => ({
      ...op.product.toJSON(),
      quantity: op.quantity,
      price: op.price,
    }));

    return res.json({
      data: {
        order: order.toJSON(),
        productDetails,
      },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, { error: err.message || "Something went wrong" });
  }
}





module.exports={createCartOrder,placeOrder,getOrderDetails}